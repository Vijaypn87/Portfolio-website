import type { Profile } from '@/types'

// All editable site content lives here. Everything below comes from your resume
// (public/Vijaypn_Resume.pdf) or from details you provided. Edit freely.
export const profile: Profile = {
  name: 'Vijay PN',
  role: 'AI / ML Engineer',

  tagline:
    'AI/ML engineering graduate building intelligent applications, from RAG systems and computer vision to full-stack software.',

  // Background removed from your illustrated portrait; the original stays in public/images.
  photo: { src: '/images/profile.webp', alt: 'Illustrated portrait of Vijay PN in a red jacket' },

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

  email: 'vijaypn.in@gmail.com',
  resumeUrl: '/Vijaypn_Resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Vijaypn87' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/vijaypnin' },
  ],
}
