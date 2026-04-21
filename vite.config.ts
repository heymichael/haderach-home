import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function platformAuthDev(): Plugin {
  let env: Record<string, string> = {}

  return {
    name: 'platform-auth-dev',
    config(_, { mode }) {
      env = loadEnv(mode, process.cwd(), 'VITE_')
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/__/firebase/init.json') {
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              apiKey: env.VITE_FIREBASE_API_KEY,
              authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
              projectId: env.VITE_FIREBASE_PROJECT_ID,
              appId: env.VITE_FIREBASE_APP_ID,
              storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
              messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
              measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
            }),
          )
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  base: '/',
  build: { outDir: 'dist' },
  plugins: [platformAuthDev(), tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/agent/api': {
        target: 'http://localhost:8080',
        rewrite: (p) => p.replace(/^\/agent\/api/, ''),
      },
      '/cms/api': {
        target: 'http://localhost:3000',
        // Passthrough — Payload serves natively at /cms/api/** locally
        // (basePath: '/cms' in haderach-cms/next.config.ts). Matches the
        // production Firebase Hosting `/cms/api/**` rewrite to cms-api Cloud Run.
      },
    },
  },
})
