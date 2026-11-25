import type { Profile } from '@/types'

// All editable site content lives here. Everything below comes from your resume
// (public/Vijaypn_Resume.pdf) or from details you provided. Edit freely.
export const profile: Profile = {
  name: 'Vijay PN',
  role: 'AI / ML Engineer',
  // The hero subtitle rotates through these, in order. The first one is also what shows when
  // the visitor prefers reduced motion.
  roles: ['AI / ML Engineer', 'Software Engineer', 'Full Stack Developer', 'RAG Systems Builder'],

  tagline:
    'I build intelligent applications using Python, PyTorch, React, FastAPI and RAG, focused on research-driven ideas and real-world impact.',
  // In the tagline: these names get a brand logo (same icons as the skill chips), these are just
  // emphasised, and this phrase is set in the accent colour.
  taglineTech: ['Python', 'PyTorch', 'React', 'FastAPI'],
  taglineTerms: ['RAG'],
  taglineAccent: 'research-driven ideas and real-world impact',

  // Your photo, shown in a circle (square works best). If the file is ever missing,
  // the older cut-out portrait below is used instead.
  photo: {
    src: '/images/vijay.webp',
    fallbackSrc: '/images/profile.webp',
    alt: 'Portrait of Vijay PN',
  },

  // Adapted from the Summary on your resume.
  bio: [
    'I am an AI/ML Engineering graduate with hands-on experience in Python, full-stack development, machine learning and RAG-based applications.',
    'I have built and deployed real-world AI and web applications through internships and projects.',
    'I am looking for entry-level Software Engineer, Python Developer or AI/ML Engineer opportunities.',
  ],

  interests: [
    { title: 'AI & machine learning', icon: 'ai' },
    { title: 'RAG systems', icon: 'rag' },
    { title: 'Computer vision', icon: 'vision' },
    { title: 'Full-stack development', icon: 'fullstack' },
  ],
  technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'PyTorch'],

  openToWork: true,
  location: { city: 'Bengaluru', timeZone: 'Asia/Kolkata', abbr: 'IST' },

  email: 'vijaypn.in@gmail.com',
  resumeUrl: '/Vijaypn_Resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Vijaypn87' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/vijaypnin' },
    { label: 'X', href: 'https://x.com/Vijaypnin' },
    { label: 'Reddit', href: 'https://www.reddit.com/user/vijaypnin/', handle: 'u/vijaypnin' },
  ],
}
