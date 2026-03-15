import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ENV_FILE = resolve(ROOT_DIR, '.env')
const ENV_EXAMPLE = resolve(ROOT_DIR, '.env.example')

const green = (msg: string) => console.log(`\x1b[32m${msg}\x1b[0m`)
const yellow = (msg: string) => console.log(`\x1b[33m${msg}\x1b[0m`)
const red = (msg: string) => console.log(`\x1b[31m${msg}\x1b[0m`)
const bold = (msg: string) => console.log(`\x1b[1m${msg}\x1b[0m`)

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

function commandExists(cmd: string): boolean {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function setEnvValue(filePath: string, key: string, value: string) {
  let content = readFileSync(filePath, 'utf-8')
  const regex = new RegExp(`^${key}=.*`, 'm')
  content = content.replace(regex, `${key}=${value}`)
  writeFileSync(filePath, content)
}

async function main() {
  bold('TanStack Start Boilerplate Setup')
  console.log()

  if (!commandExists('node')) {
    red('Node.js is required. Install it from https://nodejs.org')
    process.exit(1)
  }

  if (!commandExists('pnpm')) {
    red('pnpm is required. Run: corepack enable && corepack prepare pnpm@9.15.0 --activate')
    process.exit(1)
  }

  const nodeVersion = Number(process.version.replace('v', '').split('.')[0])
  if (nodeVersion < 20) {
    red(`Node.js 20+ required (you have ${process.version})`)
    process.exit(1)
  }

  const pnpmVersion = execSync('pnpm -v', { encoding: 'utf-8' }).trim()
  green(`Prerequisites OK (Node ${process.version}, pnpm ${pnpmVersion})`)
  console.log()

  if (existsSync(ENV_FILE)) {
    yellow('.env already exists. Skipping env setup.')
    yellow('Delete .env and re-run this script to start fresh.')
    console.log()
  } else {
    copyFileSync(ENV_EXAMPLE, ENV_FILE)

    const secret = randomBytes(32).toString('base64')
    setEnvValue(ENV_FILE, 'BETTER_AUTH_SECRET', secret)
    green('Generated BETTER_AUTH_SECRET')

    setEnvValue(ENV_FILE, 'VITE_APP_URL', 'http://localhost:3000')

    console.log()
    bold('Database URL')
    console.log('You need a PostgreSQL connection string.')
    console.log('Get a free one at https://neon.tech in about 30 seconds.')
    console.log()

    const dbUrl = await prompt('Paste your DATABASE_URL: ')

    if (!dbUrl) {
      yellow("No DATABASE_URL provided. You'll need to add it to .env before running.")
    } else {
      setEnvValue(ENV_FILE, 'DATABASE_URL', dbUrl)
      green('DATABASE_URL set')
    }

    console.log()
    green('.env created with required values')

    console.log()
    const setupGoogle = await prompt('Set up Google OAuth now? (y/N): ')
    if (/^[Yy]$/.test(setupGoogle)) {
      const gcid = await prompt('GOOGLE_CLIENT_ID: ')
      const gcsecret = await prompt('GOOGLE_CLIENT_SECRET: ')
      setEnvValue(ENV_FILE, 'GOOGLE_CLIENT_ID', gcid)
      setEnvValue(ENV_FILE, 'GOOGLE_CLIENT_SECRET', gcsecret)
      green('Google OAuth configured')
    } else {
      yellow('Skipped Google OAuth (email/password auth still works)')
    }
  }

  console.log()
  bold('Installing dependencies...')
  execSync('pnpm install', { cwd: ROOT_DIR, stdio: 'inherit' })

  console.log()
  const envContent = readFileSync(ENV_FILE, 'utf-8')
  const dbUrlMatch = envContent.match(/^DATABASE_URL=(.+)$/m)
  const dbUrlValue = dbUrlMatch?.[1]

  if (dbUrlValue) {
    bold('Pushing database schema...')
    execSync('pnpm db:push', { cwd: ROOT_DIR, stdio: 'inherit' })
    green('Database tables created')
  } else {
    yellow("Skipping db:push (no DATABASE_URL set). Run 'pnpm db:push' after adding it.")
  }

  console.log()
  console.log('==========================================')
  green('Setup complete!')
  console.log('==========================================')
  console.log()
  console.log('  pnpm dev          Start the dev server')
  console.log('  pnpm db:studio    Browse your database')
  console.log('  localhost:3000/api/docs    API documentation')
  console.log()
  yellow('Optional services (add to .env when ready):')
  console.log('  Resend     Email verification + password reset')
  console.log('  Stripe     Payments (+ Upstash Redis for caching)')
  console.log('  PostHog    Analytics')
  console.log('  Sentry     Error tracking')
  console.log()
}

main()
