import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path';

const isVercel = process.env.VERCEL === '1'
const isDev = process.env.NODE_ENV === 'development'

// https://vite.dev/config/
export default defineConfig({
  base: isDev || isVercel ? '/' : './',
  resolve: {
    alias: [{
      find: '@',
      replacement: path.resolve(__dirname, 'src')
    }]
  },
  plugins: [vue(), VitePWA({
    registerType: 'prompt',
    manifestFilename: 'site.webmanifest',
    includeAssets: ['logo.svg', 'webkubor.svg'],
    manifest: {
      name: '氛围壁纸工坊',
      short_name: '壁纸工坊',
      description: '你的心情壁纸生成器，东方美学、水彩风、极简留白。',
      start_url: '.',
      scope: '.',
      display: 'standalone',
      theme_color: '#f4d03f',
      background_color: '#1a1f36',
      orientation: 'portrait-primary',
      icons: [
        {
          src: './icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: './icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  }), AutoImport({
    imports: [
      'vue',
      {
        'naive-ui': [
          'useDialog',
          'useMessage',
          'useNotification',
          'useLoadingBar'
        ]
      }
    ],
    dts: 'src/types/auto-imports.d.ts'
  }),
  Components({
    resolvers: [NaiveUiResolver()],
    dts: 'src/types/components.d.ts'
  })],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/global.scss" as *;`
      }
    }
  },
})
