# AGENTS.md — AI 助手工作守则

## 这是什么

Ambient Wallpaper Studio —— 浏览器壁纸编辑器：为多设备制作壁纸（预设尺寸），
支持文字 / 图片水印、可复用模板、PNG 导出。**隐私优先：图片处理全部在本地完成**。

## 关键文件

- `index.html` + 应用源码：编辑器主体（Vue）。
- `AI_REQUIREMENTS.md`：AI 协作需求说明 —— 改功能前先读，里面的产品口径优先。
- `package.json`：`dev / build / preview` 标准 Vite 流程；`generate-icons` 生成图标。

## 常用命令

```bash
pnpm dev       # 开发
pnpm build     # 构建
```

## 约定

- **隐私红线**：不引入任何图片上传 / 服务端处理；新增功能不得破坏「本地处理」承诺。
- 设备预设与模板保持数据驱动，新增预设不硬编码。
- 双语 README（`README.md` / `README.en.md`）同步维护。
