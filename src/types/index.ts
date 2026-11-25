export interface SocialLink {
  label: string
  href: string
  /** Shown instead of the URL where a short name reads better, e.g. "u/vijaypnin". */
  handle?: string
}

export type InterestIcon = 'ai' | 'rag' | 'vision' | 'fullstack'

export interface Interest {
  title: string
  icon: InterestIcon
}

export interface Profile {
  name: string
  role: string
  /** Roles the hero subtitle rotates through. The first is shown alone with reduced motion. */
  roles: readonly string[]
  /** Short hero introduction. */
  tagline: string
  /** Names in the tagline that get a brand logo. */
  taglineTech: readonly string[]
  /** Names in the tagline that are only emphasised (no official logo). */
  taglineTerms: readonly string[]
  /** A phrase in the tagline shown in the accent colour. */
  taglineAccent: string
  /** Portrait shown in the hero and About. A cut-out (transparent background) works best. */
  photo: { src: string; alt: string; /** Used if `src` is missing. */ fallbackSrc?: string }
  /** About-section biography, one paragraph per entry. */
  bio: string[]
  interests: Interest[]
  technologies: string[]
  /** Shows the "open to work" pill in the hero. */
  openToWork: boolean
  /** City shown beside the live clock, and its IANA time zone. */
  location: {
    city: string
    timeZone: string
    /** Short zone label for the dock clock, e.g. IST. */ abbr: string
  }
  email: string
  /** Path to the resume PDF under /public. */
  resumeUrl: string
  socials: SocialLink[]
}

/** The categories on the Projects filter tabs, in tab order. */
export type ProjectCategory =
  'RAG/LLM' | 'Computer Vision' | 'Full Stack' | 'Data/Geospatial' | 'Developer Tools' | 'AI/ML'

export type ProjectStatus = 'live' | 'completed' | 'building'

export type ProjectCoverIcon = 'eye' | 'heart-pulse' | 'waves'

export interface ProjectImage {
  src: string
  width: number
  height: number
}

export interface Project {
  id: string
  name: string
  category: ProjectCategory
  status: ProjectStatus
  /** One sentence, shown on the card. */
  oneLiner: string
  /**
   * A screenshot, in /public/projects. If it is missing or fails to load, the generated cover is
   * shown instead, so a project never shows a broken image.
   */
  image?: ProjectImage
  /** The line icon on the generated cover (used when there is no image). */
  coverIcon?: ProjectCoverIcon
  /** The full description, shown in the details dialog. */
  description: string
  /** Exactly three short points, shown on the card. */
  highlights: readonly [string, string, string]
  /** The headline number or result. Leave it out when there is none: nothing is shown. */
  keyMetric?: string
  tech: readonly string[]
  github: string
  /** The live demo. Leave it out when there is none: no "Live Demo" button is shown. */
  live?: string
  /** Planned work, listed in the details dialog. */
  comingNext?: readonly string[]
  /** Skills the planned work would add, listed in the details dialog. */
  upcomingSkills?: readonly string[]
}

export interface SkillGroup {
  id: string
  title: string
  skills: string[]
}
