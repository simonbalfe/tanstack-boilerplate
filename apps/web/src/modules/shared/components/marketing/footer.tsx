import { Separator } from '@ui/components/separator'
import { Github, Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 font-semibold text-foreground"
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-primary">
              <Zap className="size-4 text-primary-foreground" />
            </div>
            SaaS Boilerplate
          </button>

          <nav className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
          </nav>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="size-5" />
          </a>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          Built by developers, for developers.
        </p>
      </div>
    </footer>
  )
}
