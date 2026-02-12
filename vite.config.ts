// vite.config.ts

import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const isNode = process.env.BUILD_TARGET === 'node'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    !isNode && cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: 'src',
      router: {
        routesDirectory: 'app',
      },
    }),
    viteReact(),
  ],
})
