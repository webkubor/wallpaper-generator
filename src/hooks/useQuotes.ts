// src/hooks/useQuotes.ts
import { ref } from 'vue'

// 文案库，可以扩展分类
const quotesLibrary = {
  general: [
    '风有归处，心有颜色。',
    '白日梦，也是种勇敢。',
    '此刻心境，只属于你。',
    '山川自有归途，心事不必声张。',
    '光会照进来，雪也会融化。',
    '人间值得，日子要慢慢爱。',
    '听风写意，看云成诗。',
    '心安处，便是远方。',
    '万物皆有裂隙，那是光的入口。',
    '花会开，风会停，故事会继续。',
    '留一方白，给心安静。',
    '一念之间，四季皆春。',
    '山高水长，别怕路远。',
    '月色归来，心事已淡。',
    '云自飘摇，心自澄明。',
    '慢慢走，都是风景。',
    '一纸素心，半盏清欢。',
    '时光不语，却懂得回答。',
    '明月千里，心有相知。',
    '此刻宁静，足以抵抗喧嚣。'
  ],
  // 可以扩展，比如治愈类
  healing: [
    '光会照进来，雪也会融化。',
    '花会开，风会停，故事会继续。',
    '慢慢走，都是风景。',
    '此刻宁静，足以抵抗喧嚣。'
  ]
}
// 卡片背景颜色配置 - 极简留白 / 东方美学 / 水彩风（18色精选）
// 卡片背景颜色配置 - 淡色为主，少量暗色增加层次（18色）
const cardColors = [
  // 浅色 / 高级感 / 干净
  '#f8f9fa', // 浅灰白
  '#faf3e0', // 米白
  '#fef7e0', // 淡奶油黄
  '#f0f8ff', // AliceBlue
  '#f5f5f0', // 象牙白
  '#fdf6f0', // 奶杏色
  '#eef6f5', // 水绿色调
  '#f3f4ed', // 淡灰米色
  '#f9f9f9', // 纯白备用色
  '#f0f4f7', // 淡蓝灰
  '#f4f9f8', // 浅青绿色

  // 暗色 / 沉稳 / 层次感
  '#22303c', // 深板岩蓝
  '#2b2d42', // 牛津蓝
  '#1c2a39', // 靛青
  '#264653', // 墨青蓝
  '#3a5a40', // 森林绿
  '#3f3d2e'  // 橄榄褐
]
// 字体配置 - 使用项目中的个性化字体
const fontFamilies = [
  {
    name: '可爱字体',
    value: 'cute'
  },
  {
    name: '中文AI',
    value: 'Chinese3'
  },
  {
    name: '爱心字体',
    value: 'drizzle'
  },
  {
    name: '圆润字体',
    value: 'AlimamaFangYuanTiVF-Thin'
  },
  {
    name: '中文500',
    value: 'AiChinese02'
  },
  {
    name: '英文标题',
    value: 'vampire-wars'
  }
]


export function useQuotes() {
  const currentQuote = ref('')
  const currentFontIndex = ref(0)

  // 随机取一句（默认 general）
  const getRandomQuote = (category: keyof typeof quotesLibrary = 'general') => {
    const list = quotesLibrary[category]
    const random = Math.floor(Math.random() * list.length)
    currentQuote.value = list[random]
    return currentQuote.value
  }

  // 获取随机字体
  const getRandomFont = () => {
    const random = Math.floor(Math.random() * fontFamilies.length)
    currentFontIndex.value = random
    return fontFamilies[random]
  }

  // 获取当前字体
  const getCurrentFont = () => {
    return fontFamilies[currentFontIndex.value]
  }

  return {
    currentQuote,
    currentFontIndex,
    getRandomQuote,
    getRandomFont,
    getCurrentFont,
    cardColors,
    fontFamilies
  }
}
