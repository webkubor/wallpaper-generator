# ✨ 氛围壁纸工坊

> 风有归处，心有颜色。

一个在线壁纸制作工具，让你在浏览器中轻松创建适配多种设备的精美壁纸。

## 🌟 产品特色

### 🎨 简单易用的在线编辑
- **所见即所得**：实时预览，调整即生效
- **拖拽操作**：水印和标题支持鼠标拖拽定位
- **一键上传**：直接拖拽图片到浏览器即可开始制作

### 📱 多设备壁纸制作
- **iPhone / iPad / Mac**：完美适配 Apple 全系设备尺寸
- **车载中控**：适配主流车载屏幕比例
- **自定义尺寸**：任意宽高比，满足特殊需求

### 🎭 个性化定制
- **水印系统**：支持文字/图片水印，可调节透明度、旋转角度
- **小红书大字报**：内置专属生成器，一键制作高点击率封面
- **模板保存**：支持本地保存个性化模板，随时复用

---

## 🛠️ 开发指南与目录索引 (Development Guide)

### 🗺️ 项目概览
- **技术栈**: Vue 3 + TypeScript + Vite
- **主入口**: `src/main.ts`
- **路由配置**: `src/router/index.ts` (包含 `/` 壁纸编辑器 和 `/xhs` 小红书封面两个主要页面)

### 📂 功能修改索引

#### 1. 核心页面
- **壁纸编辑器 (主页)**
  - 核心逻辑与布局: `src/components/WallpaperEditor.vue`
  - 状态管理: `src/composables/useWallpaper.ts` (管理壁纸的缩放、背景、文字等数据)
- **小红书封面生成器**
  - 页面主逻辑: `src/pages/poster/index.vue`
  - 预设模板数据: `src/pages/poster/components/poster-templates.json`
  - 样式提示组件: `src/pages/poster/components/DesignTips.vue`

#### 2. 工具栏与设置 (Toolbar)
位于 `src/components/toolbar/`
- **背景设置**: `BackgroundSettings.vue`
- **标题文字**: `TitleSettings.vue`
- **水印设置**: `WatermarkSettings.vue`
- **通用设置容器**: `src/components/SettingsToolbar.vue`

#### 3. 设备模型 (Frames)
位于 `src/components/` 下的各设备目录
- **iPhone**: `src/components/iphone/` (包含 PhoneFrame.vue 及刘海、信号组件)
- **iPad**: `src/components/ipad/TabletFrame.vue`
- **Mac**: `src/components/mac/MacFrame.vue`
- **车载屏幕**: `src/components/car/CarFrame.vue`
- **自定义尺寸**: `src/components/custom/CustomFrame.vue`

#### 4. 核心功能逻辑 (Utils)
位于 `src/utils/`
- **导出/下载**: `captureUtils.ts` (核心截图逻辑 html2canvas 的封装)
- **拖拽逻辑**: `dragUtils.ts`
- **颜色处理**: `colorUtils.ts`
- **本地存储**: `indexedDB.ts` (用于保存用户模板)

#### 5. 公共组件
位于 `src/components/common/`
- **顶部导航栏**: `Header.vue`
- **底部页脚**: `Footer.vue`
- **设置弹窗**: `SettingsModal.vue`

---

## 📖 使用指南

### 5分钟快速上手
1. **打开网站** - 在浏览器中访问壁纸工坊
2. **上传图片** - 点击"选择图片"或直接拖拽图片到页面
3. **选择设备** - 选择要制作的设备类型（iPhone、iPad、Mac等）
4. **添加元素** - 根据需要添加文字水印、图片水印或标题
5. **导出壁纸** - 点击"导出"按钮下载制作好的壁纸

### 进阶技巧
- **保存模板**：制作满意的样式后，点击⭐保存为模板
- **批量制作**：使用模板功能，快速复用样式

## ❓ 常见问题

**Q: 制作的壁纸会被保存在服务器上吗？**
A: 不会，所有图片处理都在您的浏览器中完成（本地处理），完全保护隐私。

**Q: 支持离线使用吗？**
A: 支持，本项目已 PWA 化，网页加载完成后即可断网使用。