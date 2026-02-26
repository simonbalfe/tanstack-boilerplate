import { CtaSection } from '@shared/components/marketing/cta-section'
import { FeaturesSection } from '@shared/components/marketing/features-section'
import { Footer } from '@shared/components/marketing/footer'
import { HeroSection } from '@shared/components/marketing/hero-section'
import { HowItWorksSection } from '@shared/components/marketing/how-it-works-section'
import { Navbar } from '@shared/components/marketing/navbar'
import { TechStackSection } from '@shared/components/marketing/tech-stack-section'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TechStackSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
