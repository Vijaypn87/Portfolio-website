import { lazy, Suspense, useEffect } from 'react'
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import { Dock } from '@/components/layout/Dock'
import { Footer } from '@/components/layout/Footer'
import { Contact } from '@/components/sections/Contact'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { AmbientBackground } from '@/components/ui/AmbientBackground'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { introWillRun, setIntroStage } from '@/lib/intro'

// The loader, with its ten script fonts, is a separate chunk that only first-time visitors fetch.
const BootIntro = lazy(() => import('@/components/ui/BootIntro'))

export default function App() {
  useSmoothScroll()

  // Safety net: if the loader never finishes (a failed download, say), show the page anyway.
  useEffect(() => {
    if (!introWillRun) return
    const id = window.setTimeout(() => setIntroStage('landed'), 9000)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[110] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
        >
          Skip to content
        </a>
        {introWillRun && (
          <ErrorBoundary onError={() => setIntroStage('landed')}>
            <Suspense
              fallback={<div aria-hidden="true" className="fixed inset-0 z-[100] bg-[#050403]" />}
            >
              <BootIntro />
            </Suspense>
          </ErrorBoundary>
        )}
        <AmbientBackground />
        <div className="relative z-10">
          <main id="main">
            <Hero />
            <Skills />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
        <Dock />
      </MotionConfig>
    </LazyMotion>
  )
}
