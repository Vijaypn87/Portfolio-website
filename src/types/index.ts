export interface SocialLink {
  label: string
  href: string
}

export type InterestIcon = 'ai' | 'rag' | 'vision' | 'fullstack'

export interface Interest {
  title: string
  icon: InterestIcon
}

export interface Profile {
  name: string
  role: string
  /** Short hero introduction. */
  tagline: string
  /** Portrait shown in the hero and About. A cut-out (transparent background) works best. */
  photo: { src: string; alt: string }
  /** About-section biography, one paragraph per entry. */
  bio: string[]
  interests: Interest[]
  technologies: string[]
  email: string
  /** Path to the resume PDF under /public. */
  resumeUrl: string
  socials: SocialLink[]
}

/** Which abstract illustration to show when a project has no screenshot yet. */
export type ProjectVisual = 'rag' | 'schemes' | 'vision' | 'flood'

export interface Project {
  id: string
  title: string
  /** Concise summary shown on the card. */
  description: string
  /** Longer points shown in the detail dialog. */
  highlights: string[]
  tags: string[]
  visual: ProjectVisual
  /** Screenshot path under /public (e.g. '/images/projects/<id>.png'). A missing file shows the illustration. */
  image?: string
  status?: 'in-progress'
  /** Extra context line, e.g. where the work was done. */
  context?: string
  githubUrl?: string
  liveUrl?: string
}

export type SkillIcon = 'code' | 'frontend' | 'backend' | 'ai' | 'tools'

export interface SkillGroup {
  id: string
  title: string
  icon: SkillIcon
  skills: string[]
}
