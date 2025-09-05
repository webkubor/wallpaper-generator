<template>
  <div class="xhs-page">
    <div class="toolbar">
      <n-input v-model:value="title" placeholder="输入封面主标题（大字）" size="large" />
      <n-input v-model:value="subtitle" placeholder="输入副标题（可选）" />

      <div class="controls">
        <div class="control-item">
          <span>主色(60%)</span>
          <input type="color" v-model="mainColor" />
        </div>
        <div class="control-item">
          <span>辅色(30%)</span>
          <input type="color" v-model="secondaryColor" />
        </div>
        <div class="control-item">
          <span>强调色(10%)</span>
          <input type="color" v-model="accentColor" />
        </div>
        <div class="control-item">
          <span>布局</span>
          <n-select v-model:value="layout" :options="layoutOptions" style="width: 140px" />
        </div>
        <div class="control-item">
          <span>显示强调元素</span>
          <n-switch v-model:value="showAccent" />
        </div>
        <div class="control-item">
          <span>自动限制≤30%</span>
          <n-switch v-model:value="autoLimitText" />
        </div>
      </div>

      <div class="controls">
        <div class="control-item">
          <span>主标题字号</span>
          <n-slider v-model:value="titleSize" :min="60" :max="180" :step="2" style="width: 180px" />
          <span class="value">{{ titleSize }}px</span>
        </div>
        <div class="control-item">
          <span>副标题字号</span>
          <n-slider v-model:value="subtitleSize" :min="18" :max="60" :step="1" style="width: 180px" />
          <span class="value">{{ subtitleSize }}px</span>
        </div>
        <div class="control-item area-indicator" :class="{ warn: textAreaPercent > 30 }">
          文字占比：<b>{{ textAreaPercent.toFixed(1) }}%</b>
          <span v-if="textAreaPercent > 30">（建议≤30%，避免触发限流）</span>
        </div>
      </div>

      <div class="controls">
        <n-button type="primary" color="#f4d03f" @click="downloadPoster">下载封面</n-button>
        <n-button secondary @click="goHome">返回首页</n-button>
      </div>
    </div>

    <div class="canvas-wrap">
      <div class="poster" ref="posterRef" :style="posterStyle">
        <!-- 辅助色 30% 区域：根据布局放置 -->
        <div v-if="layout !== 'none'" class="secondary-block" :style="secondaryBlockStyle"></div>

        <!-- 强调色 10% 元素：例如角标/圆形 -->
        <div v-if="showAccent" class="accent-badge" :style="accentStyle"></div>

        <div class="poster-inner" :style="{ color: textColor, fontFamily: currentFont.value }">
          <div ref="titleRef" class="poster-title" :style="{ fontSize: titleSize + 'px' }">
            {{ title || '小红书封面大字报' }}
          </div>
          <div ref="subtitleRef" class="poster-subtitle" v-if="subtitle" :style="{ fontSize: subtitleSize + 'px' }">
            {{ subtitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { NButton, NInput, NSlider, NSwitch, NSelect } from 'naive-ui';
import { useRouter } from 'vue-router';
import { captureAndDownload } from '@/utils/captureUtils';
import { formatFileTimestamp } from '@/utils/time';
import { useQuotes } from '@/hooks/useQuotes';

const router = useRouter();
const { getRandomFont } = useQuotes();
const currentFont = ref(getRandomFont());

const title = ref('');
const subtitle = ref('');
const textColor = ref('#ffffff');
// 631 配色
const mainColor = ref('#141414');
const secondaryColor = ref('#222222');
const accentColor = ref('#f4d03f');

// 布局：none / bottom30 / side30
const layout = ref<'none' | 'bottom30' | 'side30'>('bottom30');
const layoutOptions = [
  { label: '无辅助区', value: 'none' },
  { label: '底部 30%', value: 'bottom30' },
  { label: '侧边 30%', value: 'side30' },
];

const showAccent = ref(true);
const autoLimitText = ref(true);
const titleSize = ref(120);
const subtitleSize = ref(28);

const posterRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const subtitleRef = ref<HTMLElement | null>(null);

// 3:4 固定尺寸导出，响应式下也保持比例
const posterStyle = computed(() => ({
  backgroundColor: mainColor.value,
}));

// 计算辅助色 30% 区域样式
const secondaryBlockStyle = computed(() => {
  if (!posterRef.value) return {};
  const w = posterRef.value.clientWidth;
  const h = posterRef.value.clientHeight;
  const style: Record<string, string> = {
    backgroundColor: secondaryColor.value,
    position: 'absolute',
  };
  if (layout.value === 'bottom30') {
    style.left = '0';
    style.right = '0';
    style.bottom = '0';
    style.height = Math.round(h * 0.3) + 'px';
  } else if (layout.value === 'side30') {
    style.top = '0';
    style.bottom = '0';
    style.right = '0';
    style.width = Math.round(w * 0.3) + 'px';
  }
  return style;
});

// 计算强调色 10% 区域：放置右上角角标，面积约为 10%
const accentStyle = computed(() => {
  if (!posterRef.value) return {};
  const w = posterRef.value.clientWidth;
  const h = posterRef.value.clientHeight;
  const area = w * h * 0.1; // 10%
  const size = Math.round(Math.sqrt(area)); // 近似正方形
  return {
    position: 'absolute',
    top: '24px',
    right: '24px',
    width: size + 'px',
    height: size + 'px',
    backgroundColor: accentColor.value,
    borderRadius: '12px',
    opacity: '0.9'
  } as Record<string, string>;
});

// 计算文字占比
const textAreaPercent = ref(0);
const calcTextArea = () => {
  if (!posterRef.value) return;
  const posterRect = posterRef.value.getBoundingClientRect();
  let area = 0;
  if (titleRef.value) {
    const r = titleRef.value.getBoundingClientRect();
    area += r.width * r.height;
  }
  if (subtitleRef.value) {
    const r = subtitleRef.value.getBoundingClientRect();
    area += r.width * r.height;
  }
  const percent = (area / (posterRect.width * posterRect.height)) * 100;
  textAreaPercent.value = percent;
  if (autoLimitText.value && percent > 30) {
    // 按比例缩小标题字号以回到阈值附近（粗略近似）
    const ratio = Math.sqrt(30 / percent);
    titleSize.value = Math.max(60, Math.floor(titleSize.value * ratio));
    subtitleSize.value = Math.max(18, Math.floor(subtitleSize.value * ratio));
    nextTick(() => calcTextArea());
  }
};

watch([
  title, subtitle, textColor, mainColor, secondaryColor, accentColor, layout, showAccent,
  titleSize, subtitleSize
], () => nextTick(calcTextArea));

onMounted(() => nextTick(calcTextArea));

const downloadPoster = async () => {
  if (!posterRef.value) return;
  try {
    await captureAndDownload(posterRef.value, `xhs-cover-${formatFileTimestamp()}.png`, {
      backgroundColor: null,
      scale: 2,
      useCORS: true
    });
    window.$message?.success('封面已下载');
  } catch (e) {
    console.error(e);
    window.$message?.error('下载失败');
  }
};

const goHome = () => router.push('/');
</script>

<style scoped lang="scss">
.xhs-page {
  display: flex;
  gap: 16px;
  padding: 16px;
}
.toolbar {
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.control-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.04);
  padding: 6px 10px;
  border-radius: 8px;
}
.canvas-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.poster {
  width: 900px;
  height: 1200px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}
.poster-inner {
  position: relative;
  z-index: 2;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.poster-title {
  font-size: 120px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: 2px;
}
.poster-subtitle {
  margin-top: 12px;
  font-size: 28px;
  opacity: 0.9;
}
.secondary-block {
  position: absolute;
  z-index: 1;
}
.accent-badge {
  position: absolute;
  z-index: 3;
}
@media (max-width: 1024px) {
  .xhs-page {
    flex-direction: column;
  }
  .toolbar {
    width: 100%;
  }
  .poster {
    width: 100%;
    height: auto;
    aspect-ratio: 3/4;
  }
  .poster-title {
    font-size: 13vw;
  }
  .poster-subtitle {
    font-size: 3.2vw;
  }
}
.area-indicator {
  font-weight: 600;
  &.warn { color: #e74c3c; }
  .value { opacity: 0.7; margin-left: 6px; }
}
</style>
