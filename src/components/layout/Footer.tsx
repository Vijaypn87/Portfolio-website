import { profile } from '@/data/profile'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <Container className="text-sm text-ink-muted">
        © {new Date().getFullYear()} {profile.name}
      </Container>
    </footer>
  )
}
