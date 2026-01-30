import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { db } from '@/src/services/db'
import { user } from '@/src/services/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/src/services/better-auth/auth'

export const deleteUser = createServerFn({ method: 'POST' })
  .inputValidator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const request = getRequest()

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (session?.user.id !== userId) {
      return { success: false, error: 'Unauthorized' }
    }

    try {
      await db.delete(user).where(eq(user.id, userId))
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete user' }
    }
  })
