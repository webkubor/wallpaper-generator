import { computed, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

/**
 * 移动端/小屏判定与便捷标记
 * 将与尺寸、方向等相关的 JS 逻辑集中管理
 */
export function useMobile() {
  const { width, height } = useWindowSize()

  const isSmallPhone = computed(() => width.value <= 480)
  const isMobile = computed(() => width.value <= 768)
  const isTablet = computed(() => width.value > 768 && width.value <= 1024)
  const isDesktop = computed(() => width.value > 1024)

  const isPortrait = computed(() => height.value >= width.value)
  const isLandscape = computed(() => width.value > height.value)

  /**
   * 某些需要在小屏减少动画/阴影/重计算的策略，可统一在这里给出建议开关
   */
  const preferCompactUI = computed(() => isMobile.value)

  // 移动端弹窗/抽屉类开关统一管理
  const mobileDrawerShow = ref(false)

  // 当切换到 PC（非移动端）时，自动收起移动端抽屉
  watch(isMobile, (val) => {
    if (!val) mobileDrawerShow.value = false
  }, { immediate: true })

  return {
    width,
    height,
    isSmallPhone,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    preferCompactUI,
    mobileDrawerShow,
  }
}
