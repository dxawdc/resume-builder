# 简历工坊 · ResumeStudio

> AI 驱动的在线简历制作工具 — 免费、开源、数据本地处理

**🌐 在线体验：[https://your-username.github.io/resume-studio](https://your-username.github.io/resume-studio)**

![简历工坊截图](https://img.shields.io/badge/License-MIT-green.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-blue)
![纯静态](https://img.shields.io/badge/架构-纯静态-orange)

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 📄 **Word 导入** | 上传 `.docx` 简历，AI 自动解析填充所有字段 |
| 🎨 **6 种精美模版** | 传统经典 / 现代双栏 / 暗色创意 / 极简留白 / 高管深色 / 学术正式 |
| ✦ **AI 一键优化** | 调用 Anthropic Claude API，优化文案表达、量化成果、提升关键词 |
| 💬 **AI 对话助手** | 自由对话，获取针对性简历改进建议 |
| 🖨 **导出打印** | 调用浏览器打印，支持保存为 PDF |
| 🔒 **隐私安全** | 所有数据仅在本地浏览器处理，API Key 存储在 localStorage |
| 🆓 **完全免费** | 纯静态页面，无需后端，无需注册 |

---

## 🚀 快速开始

### 方式一：直接使用在线版
访问 **[GitHub Pages 链接](https://your-username.github.io/resume-studio)**，无需安装。

### 方式二：本地运行
```bash
git clone https://github.com/your-username/resume-studio.git
cd resume-studio

# 任意 HTTP 服务器均可，例如：
npx serve .
# 或
python3 -m http.server 8080
```
然后访问 `http://localhost:8080`

### 方式三：Fork 到自己的 GitHub Pages
1. Fork 本仓库
2. 进入仓库 Settings → Pages
3. Source 选择 `main` 分支 `/root` 目录
4. 等待 1-2 分钟，访问 `https://你的用户名.github.io/resume-studio`

---

## 🤖 AI 功能配置

AI 优化功能需要 **Anthropic API Key**：

1. 访问 [console.anthropic.com](https://console.anthropic.com) 注册获取 Key（新用户有免费额度）
2. 在编辑页左侧「AI 设置」中填入 Key
3. Key 仅保存在您的浏览器本地，不会上传任何服务器

> **注意**：如果不填入 API Key，Word 解析功能会使用基础的正则提取，AI 优化按钮将不可用。其余功能（模版选择、手动编辑、导出）完全正常使用。

---

## 📁 项目结构

```
resume-studio/
├── index.html          # 主页面入口
├── css/
│   ├── main.css        # 主样式（导航、布局、组件）
│   └── templates.css   # 简历模版样式
├── js/
│   ├── app.js          # 应用控制器（路由、表单、文件处理）
│   ├── ai.js           # AI 集成（Anthropic API 调用）
│   └── templates.js    # 简历 HTML 渲染器（6种模版）
├── .github/
│   └── workflows/
│       └── pages.yml   # GitHub Actions 自动部署
├── README.md
└── LICENSE
```

---

## 🎨 模版预览

| 模版 | 风格 | 适用场景 |
|------|------|----------|
| **传统经典** | 居中标题，单栏布局 | 金融、法律、传统行业 |
| **现代双栏** | 青色侧边栏 + 主内容 | 科技、互联网 |
| **暗色创意** | 深色背景，橙色点缀 | 设计、媒体、创意行业 |
| **极简留白** | 左对齐标签，大量留白 | 咨询、学术 |
| **高管深色** | 深蓝底，金色高亮 | 高管、领导职位 |
| **学术正式** | 宋体衬线，双线装饰 | 学术研究、教育 |

---

## 🛠 技术栈

- **纯原生** HTML + CSS + JavaScript（无框架，无构建步骤）
- **字体**：Google Fonts（Noto Sans SC / Noto Serif SC / DM Serif Display）
- **Word 解析**：[Mammoth.js](https://github.com/mwilliamson/mammoth.js)（CDN 按需加载）
- **AI**：[Anthropic Claude API](https://www.anthropic.com) (claude-sonnet-4)
- **部署**：GitHub Pages

---

## 🤝 贡献

欢迎 PR！可以贡献：
- 新的简历模版
- UI 改进
- 更多语言支持
- Bug 修复

```bash
git checkout -b feature/new-template
# 开发...
git commit -m "feat: add new template"
git push origin feature/new-template
```

---

## 📄 开源协议

[MIT License](LICENSE) — 自由使用、修改、分发
