import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/games/slope/',
  build: {
    outDir: '../../../../public/games/slope',
    emptyOutDir: true,
  }
})
