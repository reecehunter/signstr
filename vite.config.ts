import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'src': './src/main.tsx',
        'popup': 'index.html',
        'content-script': './src/nostr/content-script.ts',
        'service-worker': './src/nostr/service-worker.ts',
        'nostr-provider': './src/nostr/provider.ts',
      },
      output: {
        format: 'es'
      }
    }
  }
})