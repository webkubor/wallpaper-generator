<template>
  <WallpaperEditor ref="wallpaperEditorRef" />
</template>

<script setup lang="ts">
import WallpaperEditor from '@/components/WallpaperEditor.vue';
import { ref } from 'vue';

const wallpaperEditorRef = ref();
</script>