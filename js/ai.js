/* ============================================================
   简历工坊 - AI Integration
   Uses Anthropic API (key stored in localStorage)
   ============================================================ */

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-20250514';

/** Retrieve API key from input or localStorage */
function getApiKey() {
  const input = document.getElementById('api-key');
  return (input && input.value.trim()) || localStorage.getItem('rs_api_key') || '';
}

/** Save API key to localStorage */
function saveApiKey() {
  const key = document.getElementById('api-key').value.trim();
  if (key) localStorage.setItem('rs_api_key', key);
}

/** On page load, restore saved key */
function restoreApiKey() {
  const saved = localStorage.getItem('rs_api_key');
  if (saved) {
    const input = document.getElementById('api-key');
    if (input) input.value = saved;
  }
}

/**
 * Core Claude API call
 * @param {string} userPrompt
 * @returns {Promise<string>}
 */
async function callClaude(userPrompt) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('请先在左侧填入您的 Anthropic API Key');
  }
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API 错误 ${resp.status}`);
  }

  const data = await resp.json();
  return data.content?.[0]?.text?.trim() || '';
}

/**
 * Optimize a specific section
 * @param {string} section - 'summary' | 'work1' | 'work2'
 * @param {HTMLElement} btn
 */
async function aiOptimize(section, btn) {
  const d = getFormData();
  const apiKey = getApiKey();
  if (!apiKey) { showToast('请先在左侧填入 API Key'); return; }

  let prompt = '';
  let fieldId = '';

  if (section === 'summary') {
    fieldId = 'f-summary';
    prompt = `你是专业的简历优化顾问。请优化以下中文简历个人简介，使其更专业、有力、简洁。要求：
1. 保持第一人称叙述
2. 突出核心竞争力和独特优势
3. 使用有力的动词和量化表述
4. 控制在 100 字以内
5. 只返回优化后的文本，不加任何解释或标注

原文：${d.summary}`;
  } else if (section === 'work1') {
    fieldId = 'w1-desc';
    prompt = `你是专业的简历优化顾问。请优化以下工作经历描述，要求：
1. 使用 STAR 法则（情境-任务-行动-结果）
2. 每句话以强力动词开头
3. 量化所有可量化的成果（如没有具体数字，可合理推断或使用范围值）
4. 突出个人贡献和商业价值
5. 只返回优化后的文本，不加任何说明

职位：${d.w1.pos} @ ${d.w1.company}
原文：${d.w1.desc}`;
  } else if (section === 'work2') {
    fieldId = 'w2-desc';
    prompt = `你是专业的简历优化顾问。请优化以下工作经历描述，要求：
1. 使用 STAR 法则（情境-任务-行动-结果）
2. 每句话以强力动词开头
3. 量化所有可量化的成果
4. 突出个人贡献和商业价值
5. 只返回优化后的文本，不加任何说明

职位：${d.w2.pos} @ ${d.w2.company}
原文：${d.w2.desc}`;
  }

  // Update button state
  const origHTML = btn.innerHTML;
  btn.innerHTML = `<span class="btn-spinner"></span> AI 优化中...`;
  btn.disabled = true;

  try {
    const result = await callClaude(prompt);
    document.getElementById(fieldId).value = result;
    updatePreview();
    showToast('✓ AI 优化完成');
    addAIMessage('ai', `✓ 已优化完成：\n\n${result.slice(0, 120)}${result.length > 120 ? '...' : ''}`);
    if (!aiPanelOpen) toggleAIPanel();
  } catch (err) {
    showToast('❌ ' + err.message);
  } finally {
    btn.innerHTML = origHTML;
    btn.disabled = false;
  }
}

/**
 * Quick AI optimization actions
 * @param {string} type
 */
async function quickOptimize(type) {
  const d = getFormData();
  const apiKey = getApiKey();
  if (!apiKey) {
    addAIMessage('ai', '❌ 请先在左侧「AI 设置」中填入您的 Anthropic API Key。\n\n<a href="https://console.anthropic.com" target="_blank" style="color:var(--accent)">点击获取免费 Key →</a>');
    if (!aiPanelOpen) toggleAIPanel();
    return;
  }

  const prompts = {
    overall: `你是专业的中文简历优化顾问。请全面优化以下简历内容，让表达更专业有力。
要求：量化成果、强力动词开头、突出贡献、简洁清晰。
返回 JSON 格式（不含 markdown 代码块）：{"summary":"...","work1_desc":"...","work2_desc":"..."}

简介：${d.summary}
工作1（${d.w1.pos} @ ${d.w1.company}）：${d.w1.desc}
工作2（${d.w2.pos} @ ${d.w2.company}）：${d.w2.desc}`,

    quantify: `你是专业的简历优化顾问。请为以下简历工作经历添加具体数字和量化成果（如缺少可合理推断），让内容更有说服力。
返回 JSON 格式（不含 markdown 代码块）：{"work1_desc":"...","work2_desc":"..."}

工作1（${d.w1.pos} @ ${d.w1.company}）：${d.w1.desc}
工作2（${d.w2.pos} @ ${d.w2.company}）：${d.w2.desc}`,

    keywords: `你是专业的简历优化顾问，熟悉互联网/科技行业 ATS 关键词体系。请为以下简历内容添加行业关键词，提升 ATS 通过率，同时保持自然流畅。
返回 JSON 格式（不含 markdown 代码块）：{"summary":"...","work1_desc":"...","work2_desc":"..."}

简介：${d.summary}
工作1：${d.w1.desc}
工作2：${d.w2.desc}`,

    concise: `你是专业的简历优化顾问。请精简以下简历内容，去掉冗余表达，保留核心信息，语言更加凝练。每段不超过 80 字。
返回 JSON 格式（不含 markdown 代码块）：{"summary":"...","work1_desc":"...","work2_desc":"..."}

简介：${d.summary}
工作1：${d.w1.desc}
工作2：${d.w2.desc}`,
  };

  const labels = { overall: '全面优化', quantify: '量化成果', keywords: '关键词优化', concise: '精简内容' };
  addAIMessage('user', labels[type]);
  const loadingId = addAIMessage('ai', `<span class="btn-spinner" style="border-color:rgba(196,98,45,0.3);border-top-color:var(--accent);width:12px;height:12px;display:inline-block;border-width:2px;border-radius:50%;animation:spin 0.6s linear infinite;"></span> 正在优化...`, true);

  try {
    const text = await callClaude(prompts[type]);
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    let updated = [];
    if (result.summary)    { document.getElementById('f-summary').value = result.summary; updated.push('个人简介'); }
    if (result.work1_desc) { document.getElementById('w1-desc').value = result.work1_desc; updated.push(d.w1.company || '工作1'); }
    if (result.work2_desc) { document.getElementById('w2-desc').value = result.work2_desc; updated.push(d.w2.company || '工作2'); }
    updatePreview();

    updateAIMessage(loadingId, `✓ 优化完成！已更新：${updated.join('、')}\n\n${result.summary ? `<strong>简介：</strong>${result.summary.slice(0, 60)}...\n\n` : ''}${result.work1_desc ? `<strong>${d.w1.company}：</strong>${result.work1_desc.slice(0, 60)}...` : ''}`);
    showToast('✓ 简历内容已更新');
  } catch (err) {
    updateAIMessage(loadingId, '❌ 优化失败：' + err.message);
  }
}

/**
 * Send a free-form AI chat message
 */
async function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  const apiKey = getApiKey();
  if (!apiKey) {
    addAIMessage('ai', '❌ 请先在左侧「AI 设置」中填入您的 Anthropic API Key。');
    return;
  }

  addAIMessage('user', msg);
  const d = getFormData();
  const loadingId = addAIMessage('ai', `<span class="btn-spinner" style="border-color:rgba(196,98,45,0.3);border-top-color:var(--accent);width:12px;height:12px;display:inline-block;border-width:2px;border-radius:50%;animation:spin 0.6s linear infinite;"></span> 思考中...`, true);

  const sysContext = `你是专业的简历顾问。当前用户简历信息：
姓名：${d.name}，职位：${d.title}，城市：${d.city}
简介：${d.summary}
工作经历1：${d.w1.pos} @ ${d.w1.company}（${d.w1.date}）— ${d.w1.desc}
工作经历2：${d.w2.pos} @ ${d.w2.company}（${d.w2.date}）— ${d.w2.desc}
教育：${d.edu.school} ${d.edu.major}
技能：${d.skills.join('、')}

请根据上述信息，给出专业、具体的建议。如果需要提供修改后的文本，请直接给出。回答控制在 200 字以内，简洁实用。`;

  try {
    const reply = await callClaude(`${sysContext}\n\n用户问题：${msg}`);
    updateAIMessage(loadingId, reply.replace(/\n/g, '<br>'));
  } catch (err) {
    updateAIMessage(loadingId, '❌ ' + err.message);
  }
}

/**
 * Parse a DOCX file using mammoth and fill the form via AI
 */
async function parseAndFillResume(text) {
  const apiKey = getApiKey();
  const prompt = `请从以下简历文本中提取信息，返回 JSON 格式（不含 markdown 代码块）：
{
  "name": "姓名",
  "title": "职位头衔",
  "email": "邮箱",
  "phone": "电话",
  "city": "城市",
  "link": "网址或LinkedIn",
  "summary": "个人简介",
  "work1_company": "公司1",
  "work1_pos": "职位1",
  "work1_date": "时间1",
  "work1_desc": "描述1",
  "work2_company": "公司2（如有）",
  "work2_pos": "职位2",
  "work2_date": "时间2",
  "work2_desc": "描述2",
  "edu_school": "学校",
  "edu_major": "专业学位",
  "edu_date": "时间",
  "edu_note": "备注GPA等",
  "skills": "技能1, 技能2, 技能3"
}
如某字段无对应信息请返回空字符串。只返回 JSON。

简历内容：
${text.slice(0, 4000)}`;

  if (apiKey) {
    try {
      const raw = await callClaude(prompt);
      return JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch (_) {}
  }

  // Fallback: basic regex extraction
  return extractBasicInfo(text);
}

/**
 * Very basic regex fallback when no API key
 */
function extractBasicInfo(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  const phoneMatch = text.match(/1[3-9]\d[-\s]?\d{4}[-\s]?\d{4}/);
  return {
    name: lines[0] || '',
    title: lines[1] || '',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    city: '', link: '', summary: '',
    work1_company: '', work1_pos: '', work1_date: '', work1_desc: '',
    work2_company: '', work2_pos: '', work2_date: '', work2_desc: '',
    edu_school: '', edu_major: '', edu_date: '', edu_note: '', skills: ''
  };
}
