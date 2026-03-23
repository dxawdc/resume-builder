/* ============================================================
   简历工坊 - App Controller
   ============================================================ */

/* ── State ── */
let currentTemplate = 'classic';
let aiPanelOpen     = false;
let aiMessageCount  = 0;

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  restoreApiKey();
  updatePreview();
  setupDragDrop();
  setupFileInput();
});

/* ── Page navigation ── */
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.getElementById(`tab-${page}`).classList.add('active');
  if (page === 'editor') updatePreview();
}

/* ── Template selection ── */
function selectTemplate(tpl) {
  currentTemplate = tpl;
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`[data-tpl="${tpl}"]`);
  if (card) card.classList.add('selected');

  const meta = {
    classic:   ['传统经典模版', '稳重大方风格'],
    modern:    ['现代双栏模版', '清晰专业风格'],
    creative:  ['暗色创意模版', '个性创意风格'],
    minimal:   ['极简留白模版', '简洁优雅风格'],
    executive: ['高管深色模版', '高端大气风格'],
    academic:  ['学术正式模版', '严谨规范风格'],
  };
  document.getElementById('templateLabel').textContent = meta[tpl]?.[0] || '编辑简历';
  document.getElementById('templateDesc').textContent  = meta[tpl]?.[1] || '';

  showPage('editor');
  updatePreview();
}

/* ── Form data ── */
function getFormData() {
  const val = id => document.getElementById(id)?.value || '';
  return {
    name:  val('f-name'),
    title: val('f-title'),
    email: val('f-email'),
    phone: val('f-phone'),
    city:  val('f-city'),
    link:  val('f-link'),
    summary: val('f-summary'),
    w1: {
      company: val('w1-company'), pos:  val('w1-pos'),
      date:    val('w1-date'),    desc: val('w1-desc'),
    },
    w2: {
      company: val('w2-company'), pos:  val('w2-pos'),
      date:    val('w2-date'),    desc: val('w2-desc'),
    },
    edu: {
      school: val('edu-school'), major: val('edu-major'),
      date:   val('edu-date'),   note:  val('edu-note'),
    },
    skills: val('f-skills').split(',').map(s => s.trim()).filter(Boolean),
  };
}

/** Fill form fields from a parsed data object */
function fillForm(info) {
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  set('f-name',    info.name);
  set('f-title',   info.title);
  set('f-email',   info.email);
  set('f-phone',   info.phone);
  set('f-city',    info.city);
  set('f-link',    info.link);
  set('f-summary', info.summary);
  set('w1-company', info.work1_company);
  set('w1-pos',     info.work1_pos);
  set('w1-date',    info.work1_date);
  set('w1-desc',    info.work1_desc);
  set('w2-company', info.work2_company);
  set('w2-pos',     info.work2_pos);
  set('w2-date',    info.work2_date);
  set('w2-desc',    info.work2_desc);
  set('edu-school', info.edu_school);
  set('edu-major',  info.edu_major);
  set('edu-date',   info.edu_date);
  set('edu-note',   info.edu_note);
  set('f-skills',   info.skills);
}

/* ── Preview ── */
function updatePreview() {
  const canvas = document.getElementById('resume-canvas');
  if (!canvas) return;

  // Reset class names — remove old template class
  canvas.className = 'tpl-' + currentTemplate;

  // For templates that need full-bleed, remove padding via inline
  if (['modern', 'creative', 'executive'].includes(currentTemplate)) {
    canvas.style.padding = '0';
  } else {
    canvas.style.padding = '';
  }

  canvas.innerHTML = renderTemplate(currentTemplate, getFormData());
}

/* ── File upload ── */
function setupFileInput() {
  const input = document.getElementById('fileInput');
  if (!input) return;
  input.addEventListener('change', e => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });
}

function setupDragDrop() {
  const zone = document.getElementById('uploadZone');
  if (!zone) return;
  zone.addEventListener('click', () => document.getElementById('fileInput').click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });
}

async function handleFile(file) {
  if (!file.name.match(/\.docx?$/i)) {
    showToast('❌ 请上传 .docx 格式的文件');
    return;
  }
  showLoading('正在解析 Word 文档...');

  try {
    // Dynamically load mammoth.js
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    showLoading('AI 正在识别简历内容...');
    const info = await parseAndFillResume(text);
    fillForm(info);
    updatePreview();
    hideLoading();
    showToast('✓ 简历解析成功，请选择模版');
  } catch (err) {
    hideLoading();
    showToast('❌ 解析失败：' + err.message);
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

/* ── AI Panel ── */
function toggleAIPanel() {
  aiPanelOpen = !aiPanelOpen;
  const panel  = document.getElementById('aiPanel');
  const layout = document.getElementById('editorLayout');
  panel.classList.toggle('open', aiPanelOpen);
  if (layout) layout.style.paddingRight = aiPanelOpen ? '340px' : '0';
}

let _msgIdCounter = 0;
/**
 * Add a message to the AI panel
 * @param {'ai'|'user'} role
 * @param {string} html
 * @param {boolean} returnId - if true, returns element id for later update
 * @returns {string|undefined}
 */
function addAIMessage(role, html, returnId = false) {
  const body = document.getElementById('aiMessages');
  if (!body) return;
  const id = `ai-msg-${++_msgIdCounter}`;
  const div = document.createElement('div');
  div.id = id;
  div.className = `ai-message ${role}`;
  div.innerHTML = typeof html === 'string' ? html.replace(/\n/g, '<br>') : '';
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return returnId ? id : undefined;
}

/**
 * Update an existing AI message by id
 */
function updateAIMessage(id, html) {
  const el = document.getElementById(id);
  if (el) {
    el.innerHTML = typeof html === 'string' ? html.replace(/\n/g, '<br>') : '';
    document.getElementById('aiMessages').scrollTop = 9999;
  }
}

/* ── Export / Print ── */
function exportResume() {
  showToast('正在准备打印预览...');
  window.print();
}

/* ── Toast ── */
let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Loading overlay ── */
function showLoading(text = 'AI 正在处理...') {
  const overlay = document.getElementById('loadingOverlay');
  const label   = document.getElementById('loadingText');
  if (overlay) overlay.classList.add('active');
  if (label)   label.textContent = text;
}
function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.remove('active');
}
