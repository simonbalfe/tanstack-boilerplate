import { config } from '@repo/config'
import { Resend } from 'resend'

export const resend = new Resend(config.RESEND_API_KEY)

export { sendWelcomeEmail } from './send'
