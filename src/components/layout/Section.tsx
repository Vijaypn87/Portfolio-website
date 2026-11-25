import type { ReactNode } from 'react'
import { Container } from './Container'
import { GridFrame } from './GridFrame'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: string
  className?: string
  children: ReactNode
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('relative py-[16px] sm:py-[20px] lg:py-[24px]', className)}>
      <GridFrame />
      <Container>{children}</Container>
    </section>
  )
}
