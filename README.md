# 🎨 氛围壁纸工坊 · Product Wallpaper Studio

> 风有归处，心有颜色。✨

[![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)](https://github.com/webkubor/product-wallpaper-studio)
[![AI-Powered](https://img.shields.io/badge/AI--Powered-WebMCP-orange.svg)](https://github.com/webkubor/product-wallpaper-studio)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

一个在线壁纸制作工具，让你在浏览器中轻松创建适配多种设备的精美壁纸。**现已全面接入 AI 原生交互协议 (WebMCP)！** 🤖

---

## 🌟 产品特色

### 🤖 AI 原生自动化 (New!)
- **一句话出图**：接入 WebMCP 协议，支持通过 AI 代理一句话修改背景、调整文字并自动导出。
- **AI 助手面板**：页面右下角新增 🤖 AI 按钮，一键复制 Prompt，让 AI 帮你设计。
- **智能语义理解**：AI 可感知当前所有配置，并根据你的需求进行精准微调。
- **预设模板**：支持一键应用小红书风、商务、极简、复古、可爱等风格模板。

### 🎨 简单易用的在线编辑
- **所见即所得**：实时预览，调整即生效 ⚡
- **拖拽操作**：水印和标题支持鼠标拖拽定位 🖱️
- **一键上传**：直接拖拽图片到浏览器即可开始制作 📂

### 📱 多设备壁纸制作
- **iPhone / iPad / Mac**：完美适配 Apple 全系设备尺寸 🍎
- **车载中控**：适配主流车载屏幕比例 🚗
- **自定义尺寸**：任意宽高比，满足特殊需求 📏

### 🎭 个性化定制
- **水印系统**：支持文字/图片水印，可调节透明度、旋转角度 💧
- **小红书大字报**：内置专属生成器，一键制作高点击率封面 🧧
- **模板保存**：支持本地保存个性化模板，随时复用 ⭐

---

## 🤖 AI 使用指南

### 方式一：AI 助手面板（推荐）

1. 点击页面右下角的 **🤖 AI** 悬浮按钮
2. 在面板中选择示例 Prompt，点击复制
3. 将 Prompt 发送给 Kimi、Claude、ChatGPT 等 AI 助手
4. AI 自动握手并执行操作

**示例 Prompt：**
```
帮我把背景换成深蓝色，标题改为'早安'，然后导出壁纸
把水印改成'@我的品牌'，颜色用金色，透明度调高一点
换成 iPhone 尺寸，去掉设备边框，加上透视背景效果
应用小红书模板，然后导出
```

### 方式二：AI 自动探测

支持 WebMCP 的 AI 浏览器/插件会自动：
1. 检测页面支持 WebMCP 协议
2. 读取 `/.well-known/webmcp.json` 了解可用工具
3. 用户直接说需求，AI 自动操作

---

## 🔎 功能索引

> 快速定位功能到代码位置，方便知道要去哪改。

| 功能 | 主要位置 | 说明 |
| --- | --- | --- |
| **AI 控制中心** | `src/utils/webmcp.ts` | **WebMCP 运行时接口** |
| **AI 协议定义** | `public/.well-known/webmcp.json` | **AI 工具定义说明书** |
| **AI 助手 UI** | `src/components/common/AIAssistant.vue` | **AI 助手悬浮面板** |
| 壁纸编辑器主页 | `src/components/WallpaperEditor.vue` | 核心布局与交互逻辑 |
| 壁纸状态管理 | `src/composables/useWallpaper.ts` | 缩放、背景、文字等数据 |
| 小红书封面生成器 | `src/pages/poster/index.vue` | 生成器页面主逻辑 |
| 导出下载 | `src/utils/captureUtils.ts` | 截图导出逻辑 |

---

## 🛠️ 开发指南与目录索引 (Development Guide)

### 🗺️ 项目概览
- **技术栈**: Vue 3 + TypeScript + Vite
- **AI 协议**: WebMCP (v1.0)
- **主入口**: `src/main.ts`

### 🤖 AI 开发者接入

本项目暴露了 `window.mcp` 对象，遵循 WebMCP 协议。

#### 协议发现
```html
<!-- 页面 head 中包含 -->
<link rel="alternate" type="application/webmcp+json" href="/.well-known/webmcp.json">
```

#### 握手流程
```javascript
// 1. 检测协议就绪
window.addEventListener('webmcp:ready', (e) => {
  console.log('WebMCP ready!', e.detail);
});

// 2. 发现协议入口
const discovery = window.mcp.discovery();
// { entry: '/.well-known/webmcp.json', event: 'webmcp:ready', status: 'active' }

// 3. 获取当前配置
const config = await window.mcp.call('get_wallpaper_config');

// 4. 执行操作
await window.mcp.call('update_wallpaper_config', {
  title: { text: '早安', color: '#ffffff', fontSize: 48 }
});

// 5. 导出壁纸
await window.mcp.call('export_wallpaper', { 
  mode: 'withBackground', 
  filename: 'my-wallpaper.png' 
});
```

#### 可用工具列表

| 工具名 | 功能 | 参数示例 |
|--------|------|----------|
| `get_wallpaper_config` | 获取当前所有配置 | `{}` |
| `update_wallpaper_config` | 修改水印、标题、设备、背景等 | `{ title: {...}, watermark: {...} }` |
| `set_image_url` | 更换背景图片 | `{ url: "https://..." }` |
| `export_wallpaper` | 导出并下载 | `{ mode: "withBackground", filename: "..." }` |
| `reset_wallpaper_config` | 重置为默认配置 | `{}` |
| `apply_template` | 应用预设模板 | `{ templateId: "xiaohongshu" }` |
| `set_watermark_position` | 设置水印位置 | `{ position: "bottom-right" }` |
| `get_available_templates` | 获取可用模板列表 | `{}` |
| `get_available_fonts` | 获取可用字体列表 | `{}` |

#### 预设模板 ID

| ID | 名称 | 描述 |
|----|------|------|
| `xiaohongshu` | 小红书风 | 大字报风格，适合社交媒体封面 |
| `business` | 商务简约 | 专业简约风格，适合商务场景 |
| `minimal` | 极简留白 | 极致简约，无水印无标题 |
| `vintage` | 复古胶片 | 怀旧复古风格，温暖色调 |
| `cute` | 可爱萌系 | 粉色调，可爱字体，适合萌系内容 |

---

## 📖 使用指南

### 5分钟快速上手
1. **打开网站** - 在浏览器中访问壁纸工坊
2. **上传图片** - 点击"选择图片"或直接拖拽图片到页面
3. **选择设备** - 选择要制作的设备类型（iPhone、iPad、Mac等）
4. **添加元素** - 根据需要添加文字水印、图片水印或标题
5. **导出壁纸** - 点击"导出"按钮下载制作好的壁纸

### AI 快速设计
1. **点击 AI 按钮** - 页面右下角 🤖 AI 悬浮按钮
2. **复制 Prompt** - 选择示例指令点击复制
3. **发给 AI** - 粘贴到 Kimi/Claude/ChatGPT 等
4. **自动完成** - AI 自动完成设计和导出

### 进阶技巧
- **保存模板**：制作满意的样式后，点击⭐保存为模板
- **批量制作**：使用模板功能，快速复用样式
- **AI 设计**：让 AI 帮你完成复杂的设计调整

---

## ❓ 常见问题

**Q: 制作的壁纸会被保存在服务器上吗？**
A: 不会，所有图片处理都在您的浏览器中完成（本地处理），完全保护隐私。

**Q: 支持离线使用吗？**
A: 支持，本项目已 PWA 化，网页加载完成后即可断网使用。

**Q: AI 助手如何使用？**
A: 点击页面右下角的 🤖 AI 按钮，选择示例 Prompt 复制给 AI 即可。

**Q: 哪些 AI 支持 WebMCP？**
A: 目前支持任何可以执行 JavaScript 的 AI，如 Kimi、Claude、ChatGPT（代码解释器）、以及专用的 AI 浏览器/插件。

---

## 📝 相关链接

- [WebMCP 协议定义](public/.well-known/webmcp.json)
- [更新日志](CHANGELOG.md)
- [贡献指南](CONTRIBUTING.md)
