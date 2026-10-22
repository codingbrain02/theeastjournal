import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'
import { handleCallback } from './server/telegram.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'TELEGRAM_')
  if (env.TELEGRAM_BOT_TOKEN && !process.env.TELEGRAM_BOT_TOKEN) process.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN
  if (env.TELEGRAM_CHAT_ID && !process.env.TELEGRAM_CHAT_ID) process.env.TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID
  const callbackApi = { name: 'callback-api', configureServer(server: { middlewares: { use: (path: string, handler: typeof handleCallback) => void } }) {
    server.middlewares.use('/api/callback', handleCallback)
  } }
  return { plugins: [react(), tailwindcss(), callbackApi] }
})
