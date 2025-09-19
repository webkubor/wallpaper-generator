// 设备框架组件
export { default as PhoneFrame } from './iphone/PhoneFrame.vue'
export { default as TabletFrame } from './ipad/TabletFrame.vue'
export { default as MacFrame } from './mac/MacFrame.vue'
export { default as CarFrame } from './car/CarFrame.vue'
export { default as ComboDevices } from './combo/ComboDevices.vue'
export { default as CustomFrame } from './custom/CustomFrame.vue'

// 设置工具栏组件
export { default as SettingsToolbar } from './SettingsToolbar.vue'
export { default as WatermarkSettings } from './toolbar/WatermarkSettings.vue'
export { default as TitleSettings } from './toolbar/TitleSettings.vue'
export { default as BackgroundSettings } from './toolbar/BackgroundSettings.vue'
export { default as PersonalTemplates } from './PersonalTemplates.vue'

// 移动端组件
export { default as MobileBottomSheet } from './common/MobileBottomSheet.vue'
export { default as MobileEditorControls } from './MobileEditorControls.vue'
export { default as WallpaperLibraryModal } from './WallpaperLibraryModal.vue'

// 图标
export { 
  PhUploadSimple as UploadSimple, 
  PhImage as ImageSquare, 
  PhTextT as TextT, 
  PhDrop as Droplets, 
  PhGear as Gear, 
  PhBookmarkSimple as BookmarkSimple, 
  PhArrowCounterClockwise as ArrowCounterClockwise,
  PhChatCircle as ChatCircle
} from '@phosphor-icons/vue'

// 类型
export type { UploadFileInfo } from 'naive-ui'