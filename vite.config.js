import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // '@': '/student-demo',
      // '@babylonjs/inspector': '/node_modules/@babylonjs/inspector/index.js' // 根据具体包路径调整
    }
  }
});
