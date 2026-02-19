import env from '@/src/env'
import { jwtClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

const authBaseURL = typeof window !== 'undefined' ? window.location.origin : env.APP_URL

console.log('[AUTH CLIENT] Config:', {
  baseURL: authBaseURL,
  isClient: typeof window !== 'undefined',
  envAPP_URL: env.APP_URL,
})

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  credentials: 'include',
  plugins: [jwtClient()],
})
