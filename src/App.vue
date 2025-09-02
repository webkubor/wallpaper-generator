

<template>
  <NConfigProvider :theme="currentTheme" :theme-overrides="themeOverrides">
    <NMessageProvider>
      <NGlobalStyle />
      <div class="container">
        <header class="wallpaper-generator__header">
          <h1>壁纸生成器</h1>
          <p>上传图片，添加水印，生成适合小红书的壁纸</p>
        </header>
        
        <main>
          <n-button>222</n-button>
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

import {  darkTheme, lightTheme } from "naive-ui";
import { ref } from "vue";

let localTheme = ref(darkTheme);

const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
 let theme = prefersDarkMode ? "dark" : "light";



let themeOverrides = {
  common: {
    primaryColor: "#325BFD",
    primaryColorHover: "#0033E5",
    primaryColorPressed: "#0023C0",
    primaryColorSuppl: " rgba(0, 51, 229, 0.5)",

    fontWeightStrong: "600",
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

    textColorDisabled:"#666666",
    placeholderColorDisabled:"#666666",
  },
  Space: {
    gapSmall: "4px 8px",
    gapMedium: "20px 12px", //默认 padding
    gapLarge: "12px 16px",
  },
}


if (theme === "dark") {
  localTheme.value = {
    ...themeOverrides,
    ...darkTheme
  }
} else {
  localTheme.value = {
    ...themeOverrides,
    ...lightTheme
  }
}
</script>