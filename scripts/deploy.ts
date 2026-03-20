import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ENV_FILE = resolve(ROOT_DIR, '.env')

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

function parseEnvFile(filePath: string): Record<string, string> {
  const content = readFileSync(filePath, 'utf-8')
  const env: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex)
    const value = trimmed.slice(eqIndex + 1)
    if (value) env[key] = value
  }
  return env
}

async function deployDocker(env: Record<string, string>) {
  bold('Building Docker image...')

  const buildArgs = [
    'VITE_APP_URL',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'VITE_STRIPE_PRICE_ID',
    'VITE_POSTHOG_KEY',
    'VITE_POSTHOG_HOST',
  ]
    .map((key) => `--build-arg ${key}=${env[key] ?? ''}`)
    .join(' ')

  execSync(`docker build ${buildArgs} -t tanstack-app .`, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  })

  green('Docker image built: tanstack-app')
  console.log()
  console.log('Run locally:')
  console.log('  docker run --env-file .env -p 3000:3000 tanstack-app')
  console.log()
  console.log('Push to a registry:')
  console.log('  docker tag tanstack-app your-registry/your-app:latest')
  console.log('  docker push your-registry/your-app:latest')
}

async function deployCloudflare(env: Record<string, string>) {
  bold('Building for Cloudflare Workers...')
  execSync('pnpm build', { cwd: resolve(ROOT_DIR, 'apps/web'), stdio: 'inherit' })

  console.log()
  bold('Setting secrets...')
  yellow("You'll be prompted for each value. Press Enter to skip any you don't need.")
  console.log()

  const requiredSecrets = ['DATABASE_URL', 'BETTER_AUTH_SECRET']
  const optionalSecrets = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'RESEND_API_KEY',
    'RESEND_FROM',
  ]

  for (const secret of requiredSecrets) {
    const val = env[secret]
    if (val) {
      const confirm = await prompt(`Set ${secret} from .env? (Y/n): `)
      if (!/^[Nn]$/.test(confirm)) {
        execSync(`echo '${val}' | npx wrangler secret put ${secret}`, {
          cwd: ROOT_DIR,
          stdio: 'inherit',
        })
        green(`${secret} set`)
      }
    } else {
      red(`${secret} is required but empty in .env. Set it manually:`)
      console.log(`  echo 'your-value' | npx wrangler secret put ${secret}`)
    }
  }

  for (const secret of optionalSecrets) {
    const val = env[secret]
    if (val) {
      const confirm = await prompt(`Set ${secret} from .env? (y/N): `)
      if (/^[Yy]$/.test(confirm)) {
        execSync(`echo '${val}' | npx wrangler secret put ${secret}`, {
          cwd: ROOT_DIR,
          stdio: 'inherit',
        })
        green(`${secret} set`)
      }
    }
  }

  console.log()
  bold('Deploying...')
  execSync('npx wrangler deploy', { cwd: ROOT_DIR, stdio: 'inherit' })

  green('Deployed to Cloudflare Workers')
  console.log()
  yellow('Set your custom domain in the Cloudflare dashboard:')
  console.log('  Workers & Pages > your worker > Settings > Domains & Routes')
}

async function main() {
  if (!existsSync(ENV_FILE)) {
    red("No .env file found. Run 'pnpm setup' first.")
    process.exit(1)
  }

  const env = parseEnvFile(ENV_FILE)

  bold('Deploy')
  console.log()
  console.log('  1) Docker (Railway, Fly.io, VPS)')
  console.log('  2) Cloudflare Workers')
  console.log()

  const target = await prompt('Choose target (1/2): ')

  switch (target) {
    case '1':
      await deployDocker(env)
      break
    case '2':
      await deployCloudflare(env)
      break
    default:
      red('Invalid choice')
      process.exit(1)
  }
}

main()
