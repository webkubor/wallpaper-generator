<template>
  <n-modal v-model:show="showModal" preset="card" style="width: 90%; max-width: 800px; max-height: 80vh;" title="壁纸素材库">
    <div class="wallpaper-library">
      <div class="grid">
        <div 
          v-for="(bg, index) in paperBgList" 
          :key="index" 
          class="wallpaper-item"
          @click="selectWallpaper(bg)"
        >
          <div class="image-container">
            <img :src="bg" :alt="`壁纸素材 ${index + 1}`" />
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NModal } from 'naive-ui'
import { paperBgList } from '@/source/paper-bg'

const showModal = ref(false)
const emit = defineEmits(['select'])

const open = () => {
  showModal.value = true
}

const selectWallpaper = (bgUrl: string) => {
  emit('select', bgUrl)
  showModal.value = false
}

defineExpose({
  open
})
</script>

<style scoped>
.wallpaper-library {
  padding: 12px;
  max-height: 60vh;
  overflow-y: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.wallpaper-item {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  border: 1px solid var(--n-border-color);
}

.wallpaper-item:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 默认4:3比例，但图片会保持原始比例 */
  overflow: hidden;
}

.wallpaper-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持原始比例 */
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
}
</style>