import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { resend } from '@/src/services/resend/resend-client'
import WelcomeEmail from '@/src/actions/welcome-email/welcome'
import { db } from '@/src/services/db'
import { user } from '@/src/services/db/schema'
import { eq } from 'drizzle-orm'
import env from '../../env'
import { auth } from '@/src/services/better-auth/auth'

interface EmailData {
  email: string
  name: string
  userId: string
}

export const sendWelcomeEmail = createServerFn({ method: 'POST' })
  .inputValidator((data: EmailData) => data)
  .handler(async ({ data: emailData }) => {
    const { email, name, userId } = emailData
    const request = getRequest()

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (session?.user.id !== userId) {
      return { success: false, error: 'Unauthorized' }
    }

    try {
      const result = await db.select().from(user).where(eq(user.id, userId)).limit(1)

      if (result.length === 0) {
        return { success: false, error: 'User not found' }
      }

      const fromEmail = env.RESEND_FROM

      const data = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Welcome to Our Platform',
        react: WelcomeEmail({ name }),
      })

      return { success: true, data }
    } catch (error) {
      console.error('Error sending email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }
    }
  })
