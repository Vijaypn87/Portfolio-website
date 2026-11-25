import type { SkillGroup } from '@/types'

// Skills by category, shown in this order. To add or move a skill, edit the lists below.
export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    skills: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    id: 'web',
    title: 'Web Development',
    skills: [
      'React',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'Vite',
      'Node.js',
      'Express.js',
      'FastAPI',
      'Flask',
      'Django',
      'REST APIs',
    ],
  },
  {
    id: 'core-cs',
    title: 'Core Computer Science',
    skills: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'Operating Systems',
      'Computer Networks',
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    skills: [
      'RAG',
      'Computer Vision',
      'PyTorch',
      'Scikit-learn',
      'XGBoost',
      'OpenCV',
      'YOLOv8',
      'NumPy',
      'Pandas',
      'Matplotlib',
      'Streamlit',
    ],
  },
  {
    id: 'data-tools',
    title: 'Databases & Developer Tools',
    skills: ['SQLite', 'MongoDB', 'MySQL', 'Chroma', 'Git', 'GitHub', 'Google Earth Engine'],
  },
  {
    id: 'deployment',
    title: 'Deployment & Cloud Platforms',
    skills: ['Vercel', 'Render', 'Railway', 'Netlify', 'Supabase', 'Cloudflare'],
  },
  {
    id: 'design-media',
    title: 'Design & Media',
    skills: ['Figma', 'Adobe Photoshop', 'Adobe Premiere Pro', 'Adobe After Effects'],
  },
]

/**
 * Which categories go in which column, by group id, when the skills card shows 3, 2 or 1 columns
 * (wide screens, tablets, phones). Each column is its own stack, top-aligned, so edit these lists to
 * rebalance the columns.
 */
export const skillColumns: Record<1 | 2 | 3, string[][]> = {
  3: [
    ['languages', 'web'],
    ['core-cs', 'data-tools'],
    ['ai-ml', 'deployment', 'design-media'],
  ],
  2: [
    ['languages', 'web', 'core-cs'],
    ['ai-ml', 'data-tools', 'deployment', 'design-media'],
  ],
  1: [['languages', 'web', 'core-cs', 'ai-ml', 'data-tools', 'deployment', 'design-media']],
}
