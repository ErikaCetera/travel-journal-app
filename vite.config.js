import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BearTrip',
        short_name: 'BTrip',
        description: 'Un diario di viaggio selvaggio per spiriti liberi',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2E8B57',
        icons: [
          {
            src: 'android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'Square44x44Logo.altform-lightunplated_targetsize-256.png',
            sizes: '256x256',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
