<template>
  <teleport to="body">
    <transition name="pwa-slide">
      <div v-if="isVisible" class="pwa-sheet" role="dialog" aria-live="polite">
        <div class="pwa-panel">
          <div class="pwa-handle"></div>
          <div class="pwa-title">{{ title }}</div>
          <div class="pwa-desc">{{ description }}</div>

          <div
            v-if="activeView === 'update' && (latestVersion || appVersion)"
            class="pwa-meta"
          >
            <div v-if="appVersion">当前版本 v{{ appVersion }}</div>
            <div v-if="latestVersion">最新版本 v{{ latestVersion }}</div>
          </div>

          <div v-if="activeView === 'update' && updateReleases.length" class="pwa-changelog">
            <div class="pwa-changelog-title">更新内容</div>
            <div v-for="release in updateReleases" :key="release.version" class="pwa-release">
              <div class="pwa-release-title">
                v{{ release.version }}
                <span v-if="release.date" class="pwa-release-date"> · {{ release.date }}</span>
              </div>
              <ul class="pwa-release-list">
                <li v-for="item in release.changes" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>

          <div v-if="activeView === 'ios'" class="pwa-steps">
            <div class="pwa-step">1. 点击浏览器底部“分享”按钮</div>
            <div class="pwa-step">2. 选择“添加到主屏幕”</div>
          </div>

          <div class="pwa-actions">
            <n-button
              v-if="activeView === 'update'"
              type="primary"
              class="pwa-primary"
              @click="refresh"
            >
              立即更新
            </n-button>
            <n-button
              v-if="activeView === 'install'"
              type="primary"
              class="pwa-primary"
              @click="install"
            >
              安装到桌面
            </n-button>
            <n-button
              v-if="activeView === 'ready'"
              type="primary"
              class="pwa-primary"
              @click="close"
            >
              好的
            </n-button>
            <n-button secondary @click="close">稍后</n-button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { NButton } from 'naive-ui'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { fetchVersionInfo, selectUpdateReleases, type Release } from '@/utils/versioning'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true
})

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const showInstallPrompt = ref(false)
const showOfflineReady = ref(false)
const showIosHint = ref(false)
const isIos = ref(false)
const isStandalone = ref(false)
const appVersion = __APP_VERSION__
const latestVersion = ref('')
const updateReleases = ref<Release[]>([])
const isFetchingNotes = ref(false)

const activeView = computed(() => {
  if (needRefresh.value) return 'update'
  if (showInstallPrompt.value) return 'install'
  if (showIosHint.value) return 'ios'
  if (showOfflineReady.value) return 'ready'
  return null
})

const isVisible = computed(() => Boolean(activeView.value))

const title = computed(() => {
  switch (activeView.value) {
    case 'update':
      return '发现新版本'
    case 'install':
      return '一键安装到桌面'
    case 'ios':
      return 'iOS 安装指引'
    case 'ready':
      return '已支持离线使用'
    default:
      return ''
  }
})

const description = computed(() => {
  switch (activeView.value) {
    case 'update':
      if (latestVersion.value) {
        const changeCount = updateReleases.value.reduce((sum, release) => sum + release.changes.length, 0)
        if (changeCount > 0) {
          return `新版本 v${latestVersion.value} 已就绪，本次包含 ${changeCount} 项更新内容。`
        }
        return `新版本 v${latestVersion.value} 已就绪，更新后体验更稳定的导出与离线能力。`
      }
      return '更新后体验更稳定的导出与离线能力。'
    case 'install':
      return '把壁纸工坊放到主屏幕，随时打开。'
    case 'ios':
      return 'Safari 不会弹出自动安装，请按步骤操作。'
    case 'ready':
      return '断网也能继续使用主要功能。'
    default:
      return ''
  }
})

const loadReleaseNotes = async () => {
  if (isFetchingNotes.value) return
  isFetchingNotes.value = true
  const info = await fetchVersionInfo()
  if (info) {
    latestVersion.value = info.latest
    updateReleases.value = selectUpdateReleases(info, appVersion)
  }
  isFetchingNotes.value = false
}

const refresh = () => {
  updateServiceWorker(true)
  needRefresh.value = false
}

const install = async () => {
  if (!deferredPrompt.value) return
  await deferredPrompt.value.prompt()
  try {
    await deferredPrompt.value.userChoice
  } finally {
    deferredPrompt.value = null
    showInstallPrompt.value = false
  }
}

const close = () => {
  if (needRefresh.value) needRefresh.value = false
  if (showInstallPrompt.value) showInstallPrompt.value = false
  if (showOfflineReady.value) showOfflineReady.value = false
  if (showIosHint.value) {
    showIosHint.value = false
    localStorage.setItem('pwa-ios-hint-dismissed', '1')
  }
}

onMounted(() => {
  isIos.value = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone

  const dismissed = localStorage.getItem('pwa-ios-hint-dismissed') === '1'
  if (isIos.value && !isStandalone.value && !dismissed) {
    showIosHint.value = true
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt.value = event as BeforeInstallPromptEvent
    showInstallPrompt.value = true
  })
})

watch(offlineReady, (ready) => {
  if (ready) showOfflineReady.value = true
})

watch(needRefresh, (needsUpdate) => {
  if (needsUpdate) {
    void loadReleaseNotes()
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.pwa-sheet {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;
  background: rgba(47, 46, 43, 0.32);
  backdrop-filter: blur(6px);
  z-index: 9999;
}

.pwa-panel {
  width: min(520px, 100%);
  background: linear-gradient(160deg, rgba(251, 247, 241, 0.98), rgba(239, 231, 223, 0.98));
  border-radius: 24px 24px 16px 16px;
  padding: 18px 20px 20px;
  box-shadow: 0 24px 64px rgba(63, 58, 54, 0.2);
  border: 1px solid rgba(227, 219, 210, 0.9);
}

.pwa-handle {
  width: 64px;
  height: 6px;
  background: rgba(154, 167, 161, 0.6);
  border-radius: 999px;
  margin: 0 auto 12px;
}

.pwa-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--morandi-ink);
  text-align: center;
}

.pwa-desc {
  margin-top: 8px;
  font-size: 14px;
  color: var(--morandi-ink-muted);
  text-align: center;
  line-height: 1.6;
}

.pwa-meta {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 12px;
  color: var(--morandi-ink-muted);
}

.pwa-changelog {
  margin-top: 16px;
  padding: 12px 14px;
  background: rgba(154, 167, 161, 0.12);
  border-radius: 14px;
  color: var(--morandi-ink);
}

.pwa-changelog-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.pwa-release + .pwa-release {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(154, 167, 161, 0.4);
}

.pwa-release-title {
  font-size: 12px;
  font-weight: 600;
}

.pwa-release-date {
  font-weight: 400;
  color: var(--morandi-ink-muted);
}

.pwa-release-list {
  margin: 6px 0 0;
  padding-left: 18px;
  font-size: 12px;
  color: var(--morandi-ink-muted);
  line-height: 1.6;
}

.pwa-steps {
  margin-top: 16px;
  padding: 12px 14px;
  background: rgba(154, 167, 161, 0.12);
  border-radius: 14px;
  color: var(--morandi-ink);
  font-size: 13px;
  line-height: 1.7;
}

.pwa-step + .pwa-step {
  margin-top: 6px;
}

.pwa-actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.pwa-primary {
  background: var(--gradient-primary);
  border: none;
}

.pwa-slide-enter-active,
.pwa-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.pwa-slide-enter-from,
.pwa-slide-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
</style>
