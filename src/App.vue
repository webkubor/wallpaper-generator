<script setup lang="ts">
import WallpaperEditor from './components/WallpaperEditor.vue'
</script>

<template>
  <div class="container">
    <header class="wallpaper-generator__header">
      <h1>壁纸生成器</h1>
      <p>上传图片，添加水印，生成适合小红书的壁纸</p>
    </header>
    
    <main>
      <WallpaperEditor />
    </main>
    
    <footer class="wallpaper-generator__footer">
      <p>&copy; {{ new Date().getFullYear() }} 壁纸生成器</p>
    </footer>
  </div>
</template>

<style lang="scss">
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-lg;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.wallpaper-generator {
  &__header {
    text-align: center;
    margin-bottom: $spacing-xl;
    padding: $spacing-lg 0;
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: $spacing-md;
      background: linear-gradient(45deg, $color-primary, color.adjust($color-primary, $lightness: 15%));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      font-size: $font-size-lg;
      color: $color-text-secondary;
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  &__footer {
    margin-top: auto;
    padding: $spacing-lg 0;
    text-align: center;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }
}

main {
  flex: 1;
}

// 暗黑模式适配
@media (prefers-color-scheme: dark) {
  .wallpaper-generator {
    &__header {
      h1 {
        background: linear-gradient(45deg, $color-primary-light, color.adjust($color-primary-light, $lightness: 15%));
        -webkit-background-clip: text;
        background-clip: text;
      }
      
      p {
        color: $color-text-secondary-dark;
      }
    }
    
    &__footer {
      color: $color-text-secondary-dark;
    }
  }
}
</style>
