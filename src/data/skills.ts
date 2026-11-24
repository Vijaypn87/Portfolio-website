import type { SkillGroup } from '@/types'

/** Shown under the Skills heading. Deliberately makes no claim about proficiency levels. */
export const skillsNote = 'Technologies I work with and continue to learn.'

// Taken from the Technical Skills on your resume, plus technologies named in your project and
// internship entries (TypeScript, Tailwind CSS, Vite, YOLOv8, Chroma, OpenAI, Google Earth Engine).
export const skillGroups: SkillGroup[] = [
  {
    id: 'programming',
    title: 'Programming',
    icon: 'code',
    skills: [
      'Python',
      'JavaScript',
      'TypeScript',
      'SQL',
      'Data Structures & Algorithms',
      'OOP',
      'Operating Systems',
      'Computer Networks',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    icon: 'frontend',
    skills: ['React', 'HTML', 'CSS', 'Tailwind CSS', 'Vite'],
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: 'backend',
    skills: ['FastAPI', 'Flask', 'Django', 'Node.js', 'Express.js', 'REST APIs'],
  },
  {
    id: 'ai-ml',
    title: 'AI / ML',
    icon: 'ai',
    skills: [
      'Machine learning',
      'Deep learning',
      'RAG',
      'Computer vision',
      'PyTorch',
      'Scikit-learn',
      'XGBoost',
      'OpenCV',
      'YOLOv8',
      'NumPy',
      'Pandas',
      'Streamlit',
      'OpenAI',
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Databases',
    icon: 'tools',
    skills: ['Git', 'GitHub', 'MongoDB', 'MySQL', 'Chroma', 'Google Earth Engine'],
  },
]
