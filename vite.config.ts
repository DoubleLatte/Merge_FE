/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'

// 개발 중 CORS 회피: 브라우저는 5173으로만 요청하고, Vite가 /api를 Flask(5000)로 전달한다.
export default defineConfig(({ mode }) => {
  // macOS는 5000번 포트를 AirPlay가 쓰므로 BE 포트가 다르면 .env의 VITE_API_PROXY로 바꾼다.
  const target =
    loadEnv(mode, process.cwd(), '').VITE_API_PROXY || 'http://127.0.0.1:5000'
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': target,
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
    },
  }
})
