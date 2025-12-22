import { ref, computed, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import { createDragHandler } from '@/utils/dragUtils'
import { captureAndDownload } from '@/utils/captureUtils'
import { formatFileTimestamp } from '@/utils/time'
import posterConfig from '@/pages/poster/components/poster-templates.json'
import type { PosterTemplate, Position } from '@/types/interfaces/poster'

export function usePoster() {
  // 基础文本内容
  const title = ref('江湖秘辛')
  const subtitle = ref('金庸笔下最隐秘的伏笔')
  const showSubtitle = ref(true)
  
  // 背景配置
  const backgroundType = ref('solid')
  const mainColor = ref('#1A1A1A')
  const gradientStart = ref('#1A1A1A')
  const gradientEnd = ref('#4A4A4A')
  const gradientAngle = ref(45)
  const backgroundImage = ref('')
  const backgroundSize = ref('cover')
  
  // 颜色配置
  const textColor = ref('#000000')
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
  
  // 背景类型选项
  const backgroundTypeOptions = [
    { label: '纯色', value: 'solid' },
    { label: '渐变', value: 'gradient' },
    { label: '图片', value: 'image' }
  ]

  // 背景尺寸选项
  const backgroundSizeOptions = [
    { label: '覆盖', value: 'cover' },
    { label: '包含', value: 'contain' },
    { label: '拉伸', value: '100% 100%' },
    { label: '原始尺寸', value: 'auto' },
    { label: '平铺', value: 'repeat' },
    { label: '水平平铺', value: 'repeat-x' },
    { label: '垂直平铺', value: 'repeat-y' },
    { label: '不重复', value: 'no-repeat' }
  ]
  
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
  const posterStyle = computed(() => {
    const style: any = {
      fontFamily: selectedFont.value,
      position: 'relative' as const
    }
    
    return style
  })
  
  // 海报内部样式（包含背景）
  const posterInnerStyle = computed(() => {
    console.log('posterInnerStyle computing...', {
      backgroundType: backgroundType.value,
      hasBackgroundImage: !!backgroundImage.value
    });
    
    const style: any = {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      position: 'relative' as const,
      zIndex: 1
    }
    
    if (backgroundType.value === 'gradient') {
      style.backgroundImage = `linear-gradient(${gradientAngle.value}deg, ${gradientStart.value}, ${gradientEnd.value})`
      style.backgroundColor = 'transparent'
    } else if (backgroundType.value === 'image' && backgroundImage.value) {
      const repeatModes = new Set(['repeat', 'repeat-x', 'repeat-y', 'no-repeat'])
      const repeatValue = repeatModes.has(backgroundSize.value) ? backgroundSize.value : 'no-repeat'
      const sizeValue = repeatModes.has(backgroundSize.value) ? 'auto' : backgroundSize.value

      style.backgroundColor = 'transparent'
      style.backgroundImage = `url(${backgroundImage.value})`
      style.backgroundRepeat = repeatValue
      style.backgroundSize = sizeValue
      style.backgroundPosition = 'center'
    } else {
      // 纯色背景
      style.backgroundColor = mainColor.value
      style.backgroundImage = 'none'
    }
    
    console.log('posterInnerStyle computed:', {
      backgroundType: backgroundType.value,
      backgroundImage: backgroundImage.value ? 'has image data' : 'no image',
      style
    });
    
    // 强制触发响应式更新
    console.log('Force reactive update check:', Date.now());
    
    return style
  })
  
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
  
  // 处理背景图片上传
  const handleBackgroundUpload = (fileInfo: any) => {
    try {
      console.log('handleBackgroundUpload received:', fileInfo, typeof fileInfo);
      
      let file: File;
      if (fileInfo instanceof File) {
        file = fileInfo;
      } else if (fileInfo && fileInfo.file instanceof File) {
        file = fileInfo.file;
      } else if (fileInfo && fileInfo.file && fileInfo.file.file instanceof File) {
        file = fileInfo.file.file;
      } else {
        console.error('Invalid file parameter:', fileInfo);
        window.$message?.error('无效的文件参数');
        return;
      }
      
      console.log('Extracted file:', file, file instanceof File);

      if (!file.type.startsWith('image/')) {
        window.$message?.error('请上传图片文件');
        return;
      }

      // 读取图片并设置为背景
       const reader = new FileReader();
       reader.onload = (e) => {
         try {
           const dataUrl = e.target?.result as string;
           console.log('FileReader result:', dataUrl ? dataUrl.substring(0, 50) + '...' : 'null');
           
           backgroundImage.value = dataUrl;
           backgroundType.value = 'image';
           
           console.log('Updated backgroundImage:', backgroundImage.value ? backgroundImage.value.substring(0, 50) + '...' : 'null');
           console.log('Updated backgroundType:', backgroundType.value);
           
           // 强制触发响应式更新
           nextTick(() => {
             console.log('Force trigger posterInnerStyle after nextTick')
           })
           
           window.$message?.success('背景图片上传成功');
         } catch (error) {
           console.error('图片处理失败:', error);
           window.$message?.error('图片处理失败');
         }
       };
      reader.onerror = () => {
        window.$message?.error('图片读取失败');
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('背景图片上传失败:', error);
      window.$message?.error(error?.message || '背景图片上传失败');
    }
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
    
    // 背景配置
    backgroundType,
    gradientStart,
    gradientEnd,
    gradientAngle,
    backgroundImage,
    backgroundSize,
    backgroundTypeOptions,
    backgroundSizeOptions,
    
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
    posterInnerStyle,
    
    // 引用
    posterRef,
    
    // 拖拽处理
    titleDragHandler,
    subtitleDragHandler,
    
    // 方法
    updatePositions,
    applyTemplate,
    handleBackgroundUpload,
    downloadPoster
  }
}
