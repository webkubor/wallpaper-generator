import { FastAverageColor } from 'fast-average-color'

// 创建全局颜色分析器实例
const fac = new FastAverageColor()

/**
 * 从图片URL分析颜色
 * @param url 图片URL
 * @returns 颜色分析结果
 */
export const analyzeImageColor = async (url: string) => {
  try {
    const color = await fac.getColorAsync(url)
    return {
      isDark: color.isDark,
      rgba: {
        r: color.value[0],
        g: color.value[1],
        b: color.value[2],
        a: color.value[3] / 255
      },
      hex: color.hex,
      textColor: color.isDark ? '#ffffff' : '#000000'
    }
  } catch (error) {
    console.error('图片颜色分析失败:', error)
    return null
  }
}

/**
 * 从十六进制颜色值分析颜色
 * @param hexColor 十六进制颜色值 (如: #ffffff)
 * @returns 颜色分析结果
 */
export const analyzeHexColor = async (hexColor: string) => {
  try {
    // 创建临时canvas来分析颜色
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 100
    canvas.height = 100
    
    if (ctx) {
      ctx.fillStyle = hexColor
      ctx.fillRect(0, 0, 100, 100)
      
      const color = await fac.getColorAsync(canvas)
      return {
        isDark: color.isDark,
        rgba: {
          r: color.value[0],
          g: color.value[1],
          b: color.value[2],
          a: color.value[3] / 255
        },
        hex: color.hex,
        textColor: color.isDark ? '#ffffff' : '#333333'
      }
    }
  } catch (error) {
    console.error('颜色分析失败:', error)
  }
  
  return {
    isDark: false,
    rgba: { r: 255, g: 255, b: 255, a: 1 },
    hex: hexColor,
    textColor: '#333333'
  }
}

/**
 * 获取与背景色对比度最佳的文本颜色
 * @param backgroundColor 背景色 (十六进制)
 * @returns 文本颜色
 */
export const getContrastTextColor = async (backgroundColor: string): Promise<string> => {
  const result = await analyzeHexColor(backgroundColor)
  return result.textColor
}

/**
 * 销毁颜色分析器实例（清理资源）
 */
export const destroyColorAnalyzer = () => {
  fac.destroy()
}
