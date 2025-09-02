

<template>
  <NConfigProvider :theme="isDark ? darkTheme : lightTheme" :theme-overrides="themeOverrides">
    <NMessageProvider>
      <NGlobalStyle />
      <div class="container">
        <header class="wallpaper-generator__header">
          <h1>壁纸生成器</h1>
          <p>上传图片，添加水印，生成适合小红书的壁纸</p>
        </header>
        
        <main>
          <n-button type="primary">测试按钮</n-button>
          <!-- 稍后添加 WallpaperEditor 组件 -->
        </main>
        
        <footer class="wallpaper-generator__footer">
          <p>&copy; {{ new Date().getFullYear() }} 壁纸生成器</p>
        </footer>
      </div>
    </NMessageProvider>
  </NConfigProvider>
</template>


<script setup lang="ts">
import { darkTheme, lightTheme } from "naive-ui";
import { ref } from "vue";

const isDark = ref(window.matchMedia("(prefers-color-scheme: dark)").matches);

const themeOverrides = {
  common: {
    primaryColor: "#325BFD",
    primaryColorHover: "#0033E5",
    primaryColorPressed: "#0023C0",
    primaryColorSuppl: "rgba(0, 51, 229, 0.5)",
    successColor: "#2FC25B",
    successColorHover: "#53CF74",
    successColorPressed: "#1E9C48",
    successColorSuppl: "rgba(47, 194, 91, 0.5)",

    warningColor: "#FAAD14",
    warningColorHover: "#FFC53D",
    warningColorPressed: "#D48806",
    warningColorSuppl: "rgba(250, 173, 20, 0.5)",

    errorColor: "#F5222D",
    errorColorHover: "#FF4D4F",
    errorColorPressed: "#CF1322",
    errorColorSuppl: "rgba(208, 48, 80, 0.5)",
  }

}
</script>