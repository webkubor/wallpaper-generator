// Utils相关的接口定义

export interface CaptureOptions {
  backgroundColor?: string | null
  scale?: number
  useCORS?: boolean
  allowTaint?: boolean
  foreignObjectRendering?: boolean
  logging?: boolean
  width?: number
  height?: number
}

export interface DragHandlers {
  onMouseDown: (e: MouseEvent) => void
}

export interface GuideLineOptions {
  showGuideLines?: boolean
  containerSelector?: string
  lineColor?: string
  lineWidth?: number
}

export interface Template {
  id: string
  name: string
  config: {
    watermarkSettings: any
    titleSettings: any
    previewSettings: any
    backgroundSettings: any
    downloadOption: string
  }
  previewImage: string // base64 图片数据
  timestamp: string
}