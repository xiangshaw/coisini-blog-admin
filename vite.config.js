import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 获取包含该前缀的路径
      '/coisiniBlogApi': {
        // 后端服务源地址
        target: 'http://localhost/admin',
        // 是否允许跨域
        changeOrigin: true,
        // 重写路径 将前缀/coisiniBlogApi 替换为空
        rewrite: (path) => path.replace(/^\/coisiniBlogApi/, '')
      }
    }
  }
})
