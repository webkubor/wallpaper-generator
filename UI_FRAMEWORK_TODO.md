# UI 框架替换与自研组件 TODO

## 1) 依赖与构建配置
- [ ] `package.json`: 移除 `naive-ui` 与相关依赖（如不再使用）；按需新增自研组件依赖
- [ ] `vite.config.ts`: 移除 `NaiveUiResolver()` 与 `AutoImport` 中的 `naive-ui` hooks；按需调整组件自动导入配置

## 2) 应用入口与主题接入
- [ ] `src/App.vue`: 替换 `NConfigProvider/NLayout/NLayoutContent/NGlobalStyle` 与 `themeOverrides`
- [ ] `src/styles/theme.scss`: 复用/扩展设计 Token，替代 Naive 主题覆盖
- [ ] `src/styles/global.scss`: 校对全局样式与新组件样式体系对接

## 3) 组件层替换（含 Naive UI 标签）
- [ ] `src/components/WallpaperEditor.vue`: 替换 `n-modal/n-space/n-button/n-tooltip/n-upload/n-form-item/n-select/n-switch/n-input-number`
- [ ] `src/components/SettingsToolbar.vue`: 替换 `n-card/n-collapse/n-collapse-item/n-form-item/n-upload/n-select/n-switch/n-input-number/n-space/n-tooltip/n-button`
- [ ] `src/components/common/SettingsModal.vue`: 替换 `n-modal/n-space/n-form-item/n-switch/n-icon/n-radio-group/n-radio/n-button/n-input`
- [ ] `src/components/PersonalTemplates.vue`: 替换 `n-input/n-button/n-icon`
- [ ] `src/components/common/FileUploader.vue`: 替换 `n-button`
- [ ] `src/pages/poster/index.vue`: 替换 `n-radio-group/n-radio-button/n-input/n-button/n-color-picker/n-select/n-switch/n-slider`

## 4) 样式变量清理（Naive 变量）
- [ ] `src/components/WallpaperEditor.vue`: 替换 `--n-body-color/--n-card-color/--n-border-color`
- [ ] `src/components/SettingsToolbar.vue`: 替换 `--n-card-color/--n-border-color/--n-color-hover/--n-text-color/--n-primary-color`
- [ ] `src/components/PersonalTemplates.vue`: 替换 `--n-card-color/--n-border-color/--n-text-color/--n-text-color-disabled`
- [ ] `src/pages/poster/components/templates.vue`: 替换 `--n-border-color`
- [ ] `src/components/common/MobileBottomSheet.vue`: 替换 `--n-card-color/--n-border-color`

## 5) 类型与自动生成文件
- [ ] `src/types/auto-imports.d.ts`: 更新/重生成，移除 `naive-ui` hooks 定义
- [ ] `src/types/components.d.ts`: 更新/重生成，移除 `naive-ui` 组件类型

