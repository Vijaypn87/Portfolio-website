import {
  siCloudflare,
  siCss,
  siDjango,
  siExpress,
  siFastapi,
  siFlask,
  siGit,
  siGithub,
  siGoogleearthengine,
  siHtml5,
  siJavascript,
  siMongodb,
  siMysql,
  siNetlify,
  siNodedotjs,
  siNumpy,
  siOpencv,
  siPandas,
  siPython,
  siPytorch,
  siRailway,
  siReact,
  siRender,
  siScikitlearn,
  siSqlite,
  siStreamlit,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siUltralytics,
  siVercel,
  siVite,
  type SimpleIcon,
} from 'simple-icons'

/**
 * Official brand icons from Simple Icons (https://simpleicons.org), by skill name as it is written
 * in data/skills.ts. A skill with no entry here (a concept such as "Computer Vision", or a brand
 * Simple Icons does not have, such as Chroma and XGBoost) gets a small neutral dot instead: no
 * logos are invented or drawn by hand. SQL is a language, not a product, so it has none either.
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
