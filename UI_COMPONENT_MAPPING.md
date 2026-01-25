# UI 框架迁移：组件替换映射

本清单用于把原 Naive UI 组件映射到当前自研组件体系，便于逐页替换与补齐缺口。

## 已有自研组件（可直接替换）

| Naive UI | 自研组件/方案 | 备注 |
| --- | --- | --- |
| `n-button` | `BaseButton` | 支持 `primary/secondary/outline/ghost/danger` | 
| `n-input` | `BaseInput` | 需确认是否覆盖 textarea/clearable 等特性 |
| `n-switch` | `BaseSwitch` | 现有开关样式已具备 |
| `n-slider` | `BaseSlider` | 已有滑块组件 |
| `n-modal` | `BaseModal` | 现有弹窗组件 |
| `n-card` | `BaseCard` | 已有卡片样式 |
| `n-select` | `BaseSelect` | 已有下拉组件 |
| `n-color-picker` | `BaseColorPicker` | 已有颜色选择组件 |
| `n-upload` | `FileUploader` | `src/components/common/FileUploader.vue` |
| `n-icon` | `@phosphor-icons/vue` 或内联 SVG | 统一图标规范 |
| `n-layout / n-layout-content` | 原生 `div/section/main` | 用布局类替代 |
| `n-global-style / n-config-provider` | `theme.scss` + `global.scss` | 以 Token + 全局样式替代 |

## 需要补齐的自研组件（建议新增）

| Naive UI | 建议新组件 | 典型使用场景 |
| --- | --- | --- |
| `n-form-item` | `BaseFormItem` | label + 控件布局、校验提示 |
| `n-space` | `BaseStack` / `BaseSpace` | 横向/纵向间距布局 |
| `n-tooltip` | `BaseTooltip` | 悬浮提示 |
| `n-radio-group / n-radio-button / n-radio` | `BaseRadioGroup / BaseRadio` | 模式切换、选项选择 |
| `n-input-number` | `BaseNumberInput` | 数字输入与步进 |
| `n-collapse / n-collapse-item` | `BaseAccordion` | 折叠面板 |

## 页面层替换建议（按模块）

- `src/components/WallpaperEditor.vue`
  - 重点：`upload / tooltip / form-item / select / switch / input-number`
- `src/components/SettingsToolbar.vue`
  - 重点：`card / collapse / form-item / upload / select / switch / input-number / space`
- `src/components/common/SettingsModal.vue`
  - 重点：`modal / form-item / switch / radio / input`
- `src/pages/poster/index.vue`
  - 重点：`radio-group / input / button / color-picker / select / switch / slider`

## 组件规范提示

- 统一走 `src/styles/theme.scss` 的 Token（颜色/圆角/阴影/动效）
- 组件尺寸基线对齐（如 28/34/44）
- 支持移动端触摸尺寸（>= 44px）
- 交互态至少包含 hover/active/disabled

