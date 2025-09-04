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

export function useQuotes() {
  const currentQuote = ref('')

  // 随机取一句（默认 general）
  const getRandomQuote = (category: keyof typeof quotesLibrary = 'general') => {
    const list = quotesLibrary[category]
    const random = Math.floor(Math.random() * list.length)
    currentQuote.value = list[random]
    return currentQuote.value
  }

  return {
    currentQuote,
    getRandomQuote
  }
}
