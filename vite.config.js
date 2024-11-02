import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],

  server:{

    proxy:{
      '/api':{
        target:"http://localhost:8081",
        changeOrigin: true,
        rewrite:(path)=>path.replace(/^\/api/,'') //api替换为'',

      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
