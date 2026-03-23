/* ============================================================
   简历工坊 - Template Renderers
   ============================================================ */

/**
 * Generate skill pills HTML
 * @param {string[]} skills
 * @returns {string}
 */
function skillPills(skills) {
  if (!skills || !skills.length) return '';
  return `<div class="r-skills-wrap">${skills.map(s => `<span class="r-skill-pill">${escHtml(s)}</span>`).join('')}</div>`;
}

/**
 * Escape HTML special characters
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Render Classic template
 * @param {object} d - form data
 */
function renderClassic(d) {
  return `
<div class="r-header">
  <div class="r-name">${escHtml(d.name)}</div>
  <div class="r-contact">
    ${d.email ? `<span>✉ ${escHtml(d.email)}</span>` : ''}
    ${d.phone ? `<span>📞 ${escHtml(d.phone)}</span>` : ''}
    ${d.city  ? `<span>📍 ${escHtml(d.city)}</span>`  : ''}
    ${d.link  ? `<span>🔗 ${escHtml(d.link)}</span>`  : ''}
  </div>
</div>

${d.summary ? `
<div class="r-section">
  <div class="r-section-title">个人简介</div>
  <div class="r-item-body">${escHtml(d.summary)}</div>
</div>` : ''}

<div class="r-section">
  <div class="r-section-title">工作经历</div>
  <div class="r-item">
    <div class="r-item-header">
      <span class="r-item-title">${escHtml(d.w1.pos)} · ${escHtml(d.w1.company)}</span>
      <span class="r-date">${escHtml(d.w1.date)}</span>
    </div>
    <div class="r-item-body">${escHtml(d.w1.desc)}</div>
  </div>
  ${d.w2.company ? `
  <div class="r-item">
    <div class="r-item-header">
      <span class="r-item-title">${escHtml(d.w2.pos)} · ${escHtml(d.w2.company)}</span>
      <span class="r-date">${escHtml(d.w2.date)}</span>
    </div>
    <div class="r-item-body">${escHtml(d.w2.desc)}</div>
  </div>` : ''}
</div>

<div class="r-section">
  <div class="r-section-title">教育背景</div>
  <div class="r-item">
    <div class="r-item-header">
      <span class="r-item-title">${escHtml(d.edu.school)}</span>
      <span class="r-date">${escHtml(d.edu.date)}</span>
    </div>
    <div class="r-item-sub">${escHtml(d.edu.major)}</div>
    ${d.edu.note ? `<div class="r-item-body">${escHtml(d.edu.note)}</div>` : ''}
  </div>
</div>

${d.skills.length ? `
<div class="r-section">
  <div class="r-section-title">专业技能</div>
  ${skillPills(d.skills)}
</div>` : ''}`;
}

/**
 * Render Modern (two-column) template
 */
function renderModern(d) {
  // Generate deterministic-ish skill widths
  const widths = d.skills.map((_, i) => 62 + ((i * 17 + 7) % 31));
  return `
<div class="r-sidebar">
  <div class="r-name">${escHtml(d.name)}</div>
  <div class="r-title">${escHtml(d.title)}</div>
  <div class="r-section-label">联系方式</div>
  ${d.email ? `<div class="r-contact-item">✉ ${escHtml(d.email)}</div>` : ''}
  ${d.phone ? `<div class="r-contact-item">📞 ${escHtml(d.phone)}</div>` : ''}
  ${d.city  ? `<div class="r-contact-item">📍 ${escHtml(d.city)}</div>`  : ''}
  ${d.link  ? `<div class="r-contact-item">🔗 ${escHtml(d.link)}</div>`  : ''}
  ${d.skills.length ? `
  <div class="r-section-label">专业技能</div>
  ${d.skills.map((s, i) => `
  <div class="r-skill-name">${escHtml(s)}</div>
  <div class="r-skill-bar"><div class="r-skill-fill" style="width:${widths[i]}%"></div></div>`).join('')}` : ''}
</div>
<div class="r-main">
  ${d.summary ? `
  <div class="r-section">
    <div class="r-section-title">个人简介</div>
    <div class="r-item-body">${escHtml(d.summary)}</div>
  </div>` : ''}
  <div class="r-section">
    <div class="r-section-title">工作经历</div>
    <div class="r-item">
      <div class="r-item-header">
        <span class="r-item-title">${escHtml(d.w1.pos)}</span>
        <span class="r-date">${escHtml(d.w1.date)}</span>
      </div>
      <div class="r-item-sub">${escHtml(d.w1.company)}</div>
      <div class="r-item-body">${escHtml(d.w1.desc)}</div>
    </div>
    ${d.w2.company ? `
    <div class="r-item">
      <div class="r-item-header">
        <span class="r-item-title">${escHtml(d.w2.pos)}</span>
        <span class="r-date">${escHtml(d.w2.date)}</span>
      </div>
      <div class="r-item-sub">${escHtml(d.w2.company)}</div>
      <div class="r-item-body">${escHtml(d.w2.desc)}</div>
    </div>` : ''}
  </div>
  <div class="r-section">
    <div class="r-section-title">教育背景</div>
    <div class="r-item">
      <div class="r-item-header">
        <span class="r-item-title">${escHtml(d.edu.school)}</span>
        <span class="r-date">${escHtml(d.edu.date)}</span>
      </div>
      <div class="r-item-sub">${escHtml(d.edu.major)}</div>
      ${d.edu.note ? `<div class="r-item-body">${escHtml(d.edu.note)}</div>` : ''}
    </div>
  </div>
  ${d.skills.length ? `
  <div class="r-section">
    <div class="r-section-title">其他信息</div>
    ${skillPills(d.skills)}
  </div>` : ''}
</div>`;
}

/**
 * Render Creative (dark) template
 */
function renderCreative(d) {
  return `
<div class="r-header">
  <div class="r-name">${escHtml(d.name)}</div>
  <div class="r-title">${escHtml(d.title)}</div>
  <div class="r-contact">
    ${d.email ? `<span>${escHtml(d.email)}</span>` : ''}
    ${d.phone ? `<span>${escHtml(d.phone)}</span>` : ''}
    ${d.city  ? `<span>${escHtml(d.city)}</span>`  : ''}
    ${d.link  ? `<span>${escHtml(d.link)}</span>`  : ''}
  </div>
</div>
<div class="r-body">
  <div>
    ${d.summary ? `
    <div class="r-section">
      <div class="r-section-title">关于我</div>
      <div class="r-item-body">${escHtml(d.summary)}</div>
    </div>` : ''}
    <div class="r-section">
      <div class="r-section-title">教育背景</div>
      <div class="r-item">
        <div class="r-item-title">${escHtml(d.edu.school)}</div>
        <div class="r-item-sub">${escHtml(d.edu.major)}</div>
        <div class="r-item-sub">${escHtml(d.edu.date)}</div>
        ${d.edu.note ? `<div style="font-size:12px;color:#7a7268;margin-top:3px">${escHtml(d.edu.note)}</div>` : ''}
      </div>
    </div>
    ${d.skills.length ? `
    <div class="r-section">
      <div class="r-section-title">技能标签</div>
      <div>${d.skills.map(s => `<span class="r-tag">${escHtml(s)}</span>`).join('')}</div>
    </div>` : ''}
  </div>
  <div>
    <div class="r-section">
      <div class="r-section-title">工作经历</div>
      <div class="r-item">
        <div class="r-item-header">
          <span class="r-item-title">${escHtml(d.w1.pos)}</span>
          <span class="r-date">${escHtml(d.w1.date)}</span>
        </div>
        <div class="r-item-sub">${escHtml(d.w1.company)}</div>
        <div class="r-item-body">${escHtml(d.w1.desc)}</div>
      </div>
      ${d.w2.company ? `
      <div class="r-item">
        <div class="r-item-header">
          <span class="r-item-title">${escHtml(d.w2.pos)}</span>
          <span class="r-date">${escHtml(d.w2.date)}</span>
        </div>
        <div class="r-item-sub">${escHtml(d.w2.company)}</div>
        <div class="r-item-body">${escHtml(d.w2.desc)}</div>
      </div>` : ''}
    </div>
  </div>
</div>`;
}

/**
 * Render Minimal template
 */
function renderMinimal(d) {
  return `
<div class="r-header">
  <div class="r-name">${escHtml(d.name)}</div>
  <div class="r-title">${escHtml(d.title)}</div>
  <div class="r-contact">
    ${d.email ? `<span>${escHtml(d.email)}</span>` : ''}
    ${d.phone ? `<span>${escHtml(d.phone)}</span>` : ''}
    ${d.city  ? `<span>${escHtml(d.city)}</span>`  : ''}
    ${d.link  ? `<span>${escHtml(d.link)}</span>`  : ''}
  </div>
</div>
<div class="r-divider"></div>

${d.summary ? `
<div class="r-section">
  <div class="r-section-title">简介</div>
  <div>
    <div class="r-item">
      <div class="r-item-body">${escHtml(d.summary)}</div>
    </div>
  </div>
</div>` : ''}

<div class="r-section">
  <div class="r-section-title">经历</div>
  <div>
    <div class="r-item">
      <div class="r-item-header">
        <span class="r-item-title">${escHtml(d.w1.pos)}</span>
        <span class="r-date">${escHtml(d.w1.date)}</span>
      </div>
      <div class="r-item-sub">${escHtml(d.w1.company)}</div>
      <div class="r-item-body">${escHtml(d.w1.desc)}</div>
    </div>
    ${d.w2.company ? `
    <div class="r-item">
      <div class="r-item-header">
        <span class="r-item-title">${escHtml(d.w2.pos)}</span>
        <span class="r-date">${escHtml(d.w2.date)}</span>
      </div>
      <div class="r-item-sub">${escHtml(d.w2.company)}</div>
      <div class="r-item-body">${escHtml(d.w2.desc)}</div>
    </div>` : ''}
  </div>
</div>

<div class="r-section">
  <div class="r-section-title">教育</div>
  <div>
    <div class="r-item">
      <div class="r-item-header">
        <span class="r-item-title">${escHtml(d.edu.school)}</span>
        <span class="r-date">${escHtml(d.edu.date)}</span>
      </div>
      <div class="r-item-sub">${escHtml(d.edu.major)}</div>
      ${d.edu.note ? `<div class="r-item-body">${escHtml(d.edu.note)}</div>` : ''}
    </div>
  </div>
</div>

${d.skills.length ? `
<div class="r-section">
  <div class="r-section-title">技能</div>
  <div>${skillPills(d.skills)}</div>
</div>` : ''}`;
}

/**
 * Render Executive template
 */
function renderExecutive(d) {
  return `
<div class="r-header">
  <div class="r-name">${escHtml(d.name)}</div>
  <div class="r-title">${escHtml(d.title)}</div>
  <div class="r-contact">
    ${d.email ? `<span>${escHtml(d.email)}</span>` : ''}
    ${d.phone ? `<span>${escHtml(d.phone)}</span>` : ''}
    ${d.city  ? `<span>${escHtml(d.city)}</span>`  : ''}
    ${d.link  ? `<span>${escHtml(d.link)}</span>`  : ''}
  </div>
</div>

${d.summary ? `
<div class="r-section">
  <div class="r-section-title">PROFILE</div>
  <div class="r-item-body">${escHtml(d.summary)}</div>
</div>` : ''}

<div class="r-section">
  <div class="r-section-title">EXPERIENCE</div>
  <div class="r-item">
    <div class="r-item-header">
      <span class="r-item-title">${escHtml(d.w1.pos)} · ${escHtml(d.w1.company)}</span>
      <span class="r-date">${escHtml(d.w1.date)}</span>
    </div>
    <div class="r-item-body">${escHtml(d.w1.desc)}</div>
  </div>
  ${d.w2.company ? `
  <div class="r-item">
    <div class="r-item-header">
      <span class="r-item-title">${escHtml(d.w2.pos)} · ${escHtml(d.w2.company)}</span>
      <span class="r-date">${escHtml(d.w2.date)}</span>
    </div>
    <div class="r-item-body">${escHtml(d.w2.desc)}</div>
  </div>` : ''}
</div>

<div class="r-section">
  <div class="r-section-title">EDUCATION</div>
  <div class="r-item">
    <div class="r-item-header">
      <span class="r-item-title">${escHtml(d.edu.school)}</span>
      <span class="r-date">${escHtml(d.edu.date)}</span>
    </div>
    <div class="r-item-sub">${escHtml(d.edu.major)}</div>
    ${d.edu.note ? `<div class="r-item-body">${escHtml(d.edu.note)}</div>` : ''}
  </div>
</div>

${d.skills.length ? `
<div class="r-section">
  <div class="r-section-title">CORE SKILLS</div>
  ${skillPills(d.skills)}
</div>` : ''}`;
}

/**
 * Render Academic template
 */
function renderAcademic(d) {
  return `
<div class="r-header">
  <div class="r-name">${escHtml(d.name)}</div>
  <div class="r-title">${escHtml(d.title)}</div>
  <div class="r-contact">
    ${d.email ? `<span>${escHtml(d.email)}</span>` : ''}
    ${d.phone ? `<span>${escHtml(d.phone)}</span>` : ''}
    ${d.city  ? `<span>${escHtml(d.city)}</span>`  : ''}
    ${d.link  ? `<span>${escHtml(d.link)}</span>`  : ''}
  </div>
  <div class="r-header-rule"></div>
</div>

${d.summary ? `
<div class="r-section">
  <div class="r-section-title">研究方向与简介</div>
  <div class="r-item-body">${escHtml(d.summary)}</div>
</div>` : ''}

<div class="r-section">
  <div class="r-section-title">工作经历</div>
  <div class="r-item">
    <div class="r-item-header">
      <span class="r-item-title">${escHtml(d.w1.pos)}</span>
      <span class="r-date">${escHtml(d.w1.date)}</span>
    </div>
    <div class="r-item-sub">${escHtml(d.w1.company)}</div>
    <div class="r-item-body">${escHtml(d.w1.desc)}</div>
  </div>
  ${d.w2.company ? `
  <div class="r-item">
    <div class="r-item-header">
      <span class="r-item-title">${escHtml(d.w2.pos)}</span>
      <span class="r-date">${escHtml(d.w2.date)}</span>
    </div>
    <div class="r-item-sub">${escHtml(d.w2.company)}</div>
    <div class="r-item-body">${escHtml(d.w2.desc)}</div>
  </div>` : ''}
</div>

<div class="r-section">
  <div class="r-section-title">教育背景</div>
  <div class="r-item">
    <div class="r-item-header">
      <span class="r-item-title">${escHtml(d.edu.school)}</span>
      <span class="r-date">${escHtml(d.edu.date)}</span>
    </div>
    <div class="r-item-sub">${escHtml(d.edu.major)}</div>
    ${d.edu.note ? `<div class="r-item-body">${escHtml(d.edu.note)}</div>` : ''}
  </div>
</div>

${d.skills.length ? `
<div class="r-section">
  <div class="r-section-title">技能与专长</div>
  ${skillPills(d.skills)}
</div>` : ''}`;
}

/**
 * Master render dispatch
 * @param {string} tpl
 * @param {object} d
 */
function renderTemplate(tpl, d) {
  switch (tpl) {
    case 'modern':    return renderModern(d);
    case 'creative':  return renderCreative(d);
    case 'minimal':   return renderMinimal(d);
    case 'executive': return renderExecutive(d);
    case 'academic':  return renderAcademic(d);
    default:          return renderClassic(d);
  }
}
