import { profile } from '@/data/profile'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="border-t border-line pt-8 pb-28">
      <Container className="label-mono flex flex-wrap justify-between gap-2 text-muted">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{profile.location.city}, India</span>
      </Container>
    </footer>
  )
}
