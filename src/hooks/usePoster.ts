import { ref, computed, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import { createDragHandler } from '@/utils/dragUtils'
import { captureAndDownload } from '@/utils/captureUtils'
import { formatFileTimestamp } from '@/utils/time'
import posterConfig from '@/pages/poster/components/poster-templates.json'

export interface PosterTemplate {
  title: string
  subtitle: string
  textColor: string
  mainColor: string
  titleSize: number
  subtitleSize: number
  selectedFont: string
  subtitleFont: string
  titleVertical: boolean
  subtitleVertical: boolean
  titleStroke: boolean
  titleStrokeColor: string
  subtitleColor: string
  titleShadow: string
  subtitleShadow: string
}

export interface Position {
  x: number
  y: number
}

export function usePoster() {
  // 基础文本内容
  const title = ref('江湖秘辛')
  const subtitle = ref('金庸笔下最隐秘的伏笔')
  const showSubtitle = ref(true)
  
  // 颜色配置
  const textColor = ref('#000000')
  const mainColor = ref('#1A1A1A')
  const subtitleColor = ref('#FFFFFF')
  const titleStrokeColor = ref('#DC143C')
  
  // 字体大小
  const titleSize = ref(7.5)
  const subtitleSize = ref(1.75)
  
  // 字体选择
  const selectedFont = ref('drizzle')
  const customFont = ref('')
  const subtitleFont = ref('SimSun')
  
  // 文字排版
  const titleVertical = ref('vertical')
  const subtitleVertical = ref('horizontal')
  
  // 文字效果
  const titleStroke = ref(true)
  const showLightingEffect = ref(true)
  
  // 文字阴影
  const titleShadow = ref('0 3px 15px rgba(0,0,0,0.8)')
  const subtitleShadow = ref('0 2px 8px rgba(0,0,0,0.6)')
  
  // 位置状态
  const titlePos = ref<Position>({ x: 0, y: 0 })
  const subtitlePos = ref<Position>({ x: 0, y: 0 })
  
  // 海报引用
  const posterRef = ref<HTMLElement | null>(null)
  
  // 字体选项
  const fontOptions = ref<Array<{ label: string, value: string }>>(posterConfig.fontOptions)
  
  // 格式化副标题（支持换行）
  const formatSubtitle = computed(() => {
    return subtitle.value ? subtitle.value.replace(/\n/g, '<br>') : ''
  })
  
  // 计算主标题字体
  const titleFontFamily = computed(() => {
    if (selectedFont.value === 'custom' && customFont.value) {
      return customFont.value
    } else if (selectedFont.value === 'system') {
      return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    } else {
      return selectedFont.value
    }
  })
  
  // 计算副标题字体
  const subtitleFontFamily = computed(() => {
    if (subtitleFont.value === 'custom' && customFont.value) {
      return customFont.value
    } else if (subtitleFont.value === 'system') {
      return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    } else {
      return subtitleFont.value
    }
  })
  
  // 主标题样式
  const titleStyle = computed((): CSSProperties => ({
    color: textColor.value,
    fontSize: `${titleSize.value}em`,
    fontFamily: titleFontFamily.value,
    writingMode: titleVertical.value === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
    textOrientation: titleVertical.value === 'vertical' ? 'upright' : 'mixed',
    WebkitTextStroke: titleStroke.value ? `2px ${titleStrokeColor.value}` : '',
    textShadow: titleShadow.value,
    position: 'absolute',
    left: `${titlePos.value.x}px`,
    top: `${titlePos.value.y}px`,
    cursor: 'move',
    userSelect: 'none',
    fontFeatureSettings: 'kern',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  }))
  
  // 副标题样式
  const subtitleStyle = computed((): CSSProperties => ({
    fontSize: `${subtitleSize.value}em`,
    fontFamily: subtitleFontFamily.value,
    color: subtitleColor.value,
    writingMode: subtitleVertical.value === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
    textOrientation: subtitleVertical.value === 'vertical' ? 'upright' : 'mixed',
    textShadow: subtitleShadow.value,
    position: 'absolute',
    left: `${subtitlePos.value.x}px`,
    top: `${subtitlePos.value.y}px`,
    cursor: 'move',
    userSelect: 'none',
    fontFeatureSettings: 'kern',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  }))
  
  // 海报样式
  const posterStyle = computed(() => ({
    backgroundColor: mainColor.value,
  }))
  
  // 更新位置为居中
  const updatePositions = () => {
    nextTick(() => {
      const poster = posterRef.value
      if (!poster) return

      const titleEl = document.querySelector('.poster-title') as HTMLElement
      const subtitleEl = document.querySelector('.poster-subtitle') as HTMLElement
      const posterRect = poster.getBoundingClientRect()

      // 首先计算标题位置
      if (titleEl) {
        const titleRect = titleEl.getBoundingClientRect()
        titlePos.value = {
          x: (posterRect.width - titleRect.width) / 2,
          y: (posterRect.height - titleRect.height) / 3 // 标题位于垂直方向1/3处
        }
      }

      // 然后计算副标题位置
      if (subtitleEl && showSubtitle.value) {
        const subtitleRect = subtitleEl.getBoundingClientRect()
        let newY = (posterRect.height - subtitleRect.height) * 2 / 3 // 默认在2/3处

        // 如果存在标题，则放在标题下方
        if (titleEl) {
          const titleBottom = titlePos.value.y + titleEl.offsetHeight
          const spacing = 30 // 主副标题间距
          newY = Math.max(newY, titleBottom + spacing)
        }

        subtitlePos.value = {
          x: (posterRect.width - subtitleRect.width) / 2,
          y: newY
        }
      }
    })
  }
  
  // 创建拖拽处理器
  const titleDragHandler = createDragHandler(
    (x, y) => {
      titlePos.value = { x, y }
    },
    () => titlePos.value
  )

  const subtitleDragHandler = createDragHandler(
    (x, y) => {
      subtitlePos.value = { x, y }
    },
    () => subtitlePos.value
  )
  
  // 应用模板
  const applyTemplate = (config: PosterTemplate) => {
    title.value = config.title
    subtitle.value = config.subtitle
    // 如果模板有副标题，确保显示状态为true
    showSubtitle.value = config.subtitle ? true : false
    textColor.value = config.textColor
    mainColor.value = config.mainColor
    titleSize.value = config.titleSize
    subtitleSize.value = config.subtitleSize
    selectedFont.value = config.selectedFont
    subtitleFont.value = config.subtitleFont
    titleVertical.value = config.titleVertical ? 'vertical' : 'horizontal'
    subtitleVertical.value = config.subtitleVertical ? 'vertical' : 'horizontal'
    titleStroke.value = config.titleStroke
    titleStrokeColor.value = config.titleStrokeColor
    subtitleColor.value = config.subtitleColor
    titleShadow.value = config.titleShadow
    subtitleShadow.value = config.subtitleShadow

    // 更新位置
    nextTick(() => {
      updatePositions()
      // 确保所有样式应用完成后再更新一次位置
      setTimeout(updatePositions, 50)
    })
  }
  
  // 下载海报
  const downloadPoster = async () => {
    if (!posterRef.value) return
    try {
      // 使用主标题作为文件名，清理特殊字符
      const sanitizedTitle = title.value.replace(/[^\w\u4e00-\u9fa5]/g, '_') || 'xhs-cover'

      await captureAndDownload(posterRef.value, `${sanitizedTitle}-${formatFileTimestamp()}.png`, {
        backgroundColor: mainColor.value,
        scale: 2,
        useCORS: true
      })
      window.$message?.success('封面已下载')
    } catch (e) {
      console.error(e)
      window.$message?.error('下载失败')
    }
  }
  
  return {
    // 基础状态
    title,
    subtitle,
    showSubtitle,
    formatSubtitle,
    
    // 颜色配置
    textColor,
    mainColor,
    subtitleColor,
    titleStrokeColor,
    
    // 字体配置
    titleSize,
    subtitleSize,
    selectedFont,
    customFont,
    subtitleFont,
    fontOptions,
    titleFontFamily,
    subtitleFontFamily,
    
    // 排版配置
    titleVertical,
    subtitleVertical,
    
    // 效果配置
    titleStroke,
    showLightingEffect,
    titleShadow,
    subtitleShadow,
    
    // 位置状态
    titlePos,
    subtitlePos,
    
    // 样式计算
    titleStyle,
    subtitleStyle,
    posterStyle,
    
    // 引用
    posterRef,
    
    // 拖拽处理
    titleDragHandler,
    subtitleDragHandler,
    
    // 方法
    updatePositions,
    applyTemplate,
    downloadPoster
  }
}