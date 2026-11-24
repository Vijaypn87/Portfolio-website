import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { NeuralField } from '@/components/ui/NeuralField'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { SceneLayer } from '@/three/SceneLayer'

export default function App() {
  useSmoothScroll()

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-ember-500 focus:px-4 focus:py-2 focus:text-night-950"
        >
          Skip to content
        </a>
        <NeuralField />
        <SceneLayer />
        <CustomCursor />
        <div className="relative z-10">
          <Navbar />
          <main id="main">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}
