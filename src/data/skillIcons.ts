import type { ComponentType } from 'react'
import {
  Binary,
  Box,
  Boxes,
  ChartLine,
  Cpu,
  Database,
  Eye,
  Network,
  ScanEye,
  Search,
  Terminal,
  TreeDeciduous,
  Video,
  Webhook,
} from 'lucide-react'
import {
  siCloudflare,
  siCss,
  siDjango,
  siDocker,
  siExpress,
  siFastapi,
  siFigma,
  siFlask,
  siGit,
  siGithub,
  siGoogleearthengine,
  siGooglegemini,
  siHtml5,
  siJavascript,
  siLeaflet,
  siMaplibre,
  siMongodb,
  siMysql,
  siNetlify,
  siNodedotjs,
  siNumpy,
  siAnthropic,
  siClaudecode,
  siOllama,
  siOpencv,
  siPandas,
  siPython,
  siPytorch,
  siRailway,
  siReact,
  siReactrouter,
  siRender,
  siScikitlearn,
  siSqlite,
  siStreamlit,
  siSupabase,
  siTailwindcss,
  siTanstack,
  siThreedotjs,
  siTypescript,
  siUltralytics,
  siVercel,
  siVite,
  siVitest,
  type SimpleIcon,
} from 'simple-icons'
import { AfterEffectsBadge, PhotoshopBadge, PremiereBadge } from '@/components/ui/AdobeBadge'

/**
 * Official brand icons from Simple Icons (https://simpleicons.org), by skill name as it is written
 * in data/skills.ts. A skill with no entry here has a line icon in `lineIcons` below instead: no logos
 * are invented or drawn by hand.
 *
 * This file is loaded lazily (see useSkillIcons), so the icons stay out of the main bundle.
 */
const brands: Record<string, SimpleIcon> = {
  Python: siPython,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  MySQL: siMysql,
  SQLite: siSqlite,
  MongoDB: siMongodb,
  React: siReact,
  HTML: siHtml5,
  CSS: siCss,
  'Tailwind CSS': siTailwindcss,
  Vite: siVite,
  'Node.js': siNodedotjs,
  'Express.js': siExpress,
  FastAPI: siFastapi,
  Flask: siFlask,
  Django: siDjango,
  PyTorch: siPytorch,
  'Scikit-learn': siScikitlearn,
  OpenCV: siOpencv,
  YOLOv8: siUltralytics,
  NumPy: siNumpy,
  Pandas: siPandas,
  Streamlit: siStreamlit,
  Git: siGit,
  GitHub: siGithub,
  'Google Earth Engine': siGoogleearthengine,
  Vercel: siVercel,
  Render: siRender,
  Railway: siRailway,
  Netlify: siNetlify,
  Supabase: siSupabase,
  Cloudflare: siCloudflare,
  Figma: siFigma,
  Docker: siDocker,
  'React Router': siReactrouter,
  'TanStack Start': siTanstack,
  'Anthropic SDK (Claude API)': siAnthropic,
  'Claude Code hooks': siClaudecode,
  Vitest: siVitest,
  'Three.js': siThreedotjs,
  Ollama: siOllama,
  'Google Gemini': siGooglegemini,
  Leaflet: siLeaflet,
  'MapLibre GL': siMaplibre,
}

/**
 * A simple line icon (or, for the Adobe apps, a badge in Adobe's style) for every skill or technology
 * with no official logo (concepts, and brands Simple Icons does not carry, such as Matplotlib), so no chip is left without an icon.
 */
export const lineIcons: Record<string, IconComponent> = {
  SQL: Database,
  Chroma: Database,
  ChromaDB: Database,
  'React Three Fiber': Box,
  RAG: Search,
  'Computer Vision': Eye,
  XGBoost: TreeDeciduous,
  Matplotlib: ChartLine,
  'REST APIs': Webhook,
  'Data Structures & Algorithms': Binary,
  'Object-Oriented Programming': Boxes,
  'Operating Systems': Cpu,
  'Computer Networks': Network,
  'Adobe Photoshop': PhotoshopBadge,
  'Adobe Premiere Pro': PremiereBadge,
  'Adobe After Effects': AfterEffectsBadge,
  ByteTrack: ScanEye,
  'Commander.js': Terminal,
  VideoMAE: Video,
}

/** A mark drawn at `size` px: a Lucide line icon or one of our own badges. */
type IconComponent = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>

export interface SkillIconSet {
  brands: Record<string, SkillIcon>
  lines: Record<string, IconComponent>
}

export interface SkillIcon {
  /** SVG path data on a 24x24 grid. */
  path: string
  /** Brand colour, e.g. "3776AB". */
  hex: string
  title: string
  /**
   * 'dark' logos (black and near-black brands) are lightened a lot in dark mode and 'dim' ones (deep
   * blues and purples) a little; 'light' ones (yellows, oranges, greens, pale blues) are darkened in
   * light mode; the rest keep their colour, softened a little.
   */
  tone: 'dark' | 'dim' | 'mid' | 'light'
}

/** Relative luminance (0 black, 1 white) of a hex colour. */
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((at) => {
    const channel = parseInt(hex.slice(at, at + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const skillIcons: Record<string, SkillIcon> = Object.fromEntries(
  Object.entries(brands).map(([skill, icon]) => {
    const lum = luminance(icon.hex)
    const tone: SkillIcon['tone'] =
      lum < 0.05 ? 'dark' : lum < 0.13 ? 'dim' : lum > 0.22 ? 'light' : 'mid'
    return [skill, { path: icon.path, hex: icon.hex, title: icon.title, tone }]
  }),
)
