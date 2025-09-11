// Home页面相关的接口定义

export interface Device {
  id: string
  name: string
  width: number
  height: number
  selected?: boolean
  hasFrame?: boolean
}

export interface FontOption {
  label: string
  value: string
  type?: string // 添加type字段以兼容SelectMixedOption
}

export interface PositionOption {
  value: string
  label: string
}

export interface TitleSettings {
  show: boolean
  text: string
  fontFamily: string
  color: string
  fontSize: number // 添加字体大小字段
  direction: 'horizontal' | 'vertical'
  offsetX: number
  offsetY: number
  shadowEffect: 'none' | 'default' | 'custom'
  shadowColor?: string
  shadowSize?: number
  strokeEnabled: boolean
  strokeColor: string
  strokeWidth: number
}

export interface WatermarkSettings {
  type: 'text' | 'image'
  text: string
  imageUrl?: string
  fontSize: number
  color: string
  opacity: number
  fontFamily: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  padding: number
  rotation: number
  offsetX: number
  offsetY: number
}

export interface BackgroundSettings {
  type: 'perspective' | 'color'
  color: string
  fontColor: string
}

export interface WallpaperConfig {
  width: number
  height: number
  backgroundSettings: BackgroundSettings
  title?: string
  subtitle?: string
  textColor?: string
  fontSize?: number
}