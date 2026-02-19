import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const isNode = process.env.BUILD_TARGET === 'node'

export default defineConfig({
  envDir: '../../',
  server: {
    port: 3000,
    strictPort: true,
  },
  plugins: [
    !isNode &&
      cloudflare({
        viteEnvironment: { name: 'ssr' },
        inspectorPort: false,
      }),
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
