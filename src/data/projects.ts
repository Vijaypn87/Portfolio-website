import type { Project } from '@/types'

// From the Projects section of your resume. Links are the ones embedded in the PDF; a link is
// only shown when it exists. To add a screenshot, save it at the `image` path (16:10 works best);
// until then an illustration is shown.
export const projects: Project[] = [
  {
    id: 'web-rag-evaluator',
    title: 'Web-RAG-Evaluator',
    description:
      'A full-stack RAG evaluation system for webpage-based question answering with source-grounded responses, scored on four quality metrics.',
    highlights: [
      'Engineered a full-stack RAG evaluation system combining 5+ components: web ingestion, semantic chunking, vector retrieval, grounded generation and citation validation.',
      'Built an end-to-end retrieval pipeline using FastAPI, React, OpenAI embeddings and Chroma, enabling webpage-based question answering with source-grounded responses.',
      'Implemented automated evaluation across 4 RAG quality metrics (retrieval relevance, groundedness, answer correctness and citation validity) to generate an overall quality score.',
    ],
    tags: ['Python', 'FastAPI', 'React', 'TypeScript', 'OpenAI', 'Chroma', 'RAG'],
    visual: 'rag',
    image: '/images/projects/web-rag-evaluator.png',
    githubUrl: 'https://github.com/Vijaypn87/Web-RAG-Evaluator',
    liveUrl: 'https://web-rag-evaluator-frontend.onrender.com/',
  },
  {
    id: 'namma-yojane',
    title: 'Namma-Yojane',
    description:
      'An AI-powered government scheme discovery platform for Karnataka citizens, with personalised, eligibility-based discovery across 11 user categories.',
    highlights: [
      'Developed an AI-powered government scheme discovery platform for Karnataka citizens, organising schemes across 11 user categories including students, farmers, women, entrepreneurs and senior citizens.',
      'Implemented personalised scheme discovery using age, occupation, gender and eligibility-based filtering, with structured scheme records containing benefits, required documents, application steps and official links.',
      'Built a responsive React + Vite interface with category, department and benefit filters, reusable components, client-side routing and an AI assistant integration for conversational scheme guidance.',
    ],
    tags: ['React', 'Vite', 'Tailwind CSS', 'AI', 'RAG'],
    visual: 'schemes',
    image: '/images/projects/namma-yojane.png',
    status: 'in-progress',
    githubUrl: 'https://github.com/Vijaypn87/Namma-Yojane-AI-scheme-Finder',
  },
  {
    id: 'visionguard-ai',
    title: 'VisionGuard AI',
    description:
      'An AI-powered video surveillance system that detects objects, tracks identities across frames and flags potentially anomalous activity.',
    highlights: [
      'Designed an AI-powered video surveillance system to detect objects, track identities across frames and identify potentially anomalous activities using 3-stage computer vision and temporal analysis.',
      'Processed 488 frames at 8.8 FPS, generating 10 unique object tracks through YOLOv8 detection, multi-object tracking and anomaly classification.',
      'Integrated a Streamlit monitoring dashboard with 5+ analysis outputs including object detections, tracking IDs, anomaly scores, alerts and processed-video results.',
    ],
    tags: [
      'Python',
      'Machine Learning',
      'Deep Learning',
      'YOLOv8',
      'OpenCV',
      'PyTorch',
      'Streamlit',
    ],
    visual: 'vision',
    image: '/images/projects/visionguard-ai.png',
    githubUrl:
      'https://github.com/Vijaypn87/VisionGuard-AI-Intelligent-Video-Anomaly-Detection-and-Tracking',
  },
  {
    id: 'flood-water-quality',
    title: 'Flood Detection and Water Quality Detection',
    description:
      'Flood and water-quality detection solutions using satellite imagery, built during my Python Developer internship at Conzura Soft Solutions.',
    highlights: [
      'Contributed to Flood Detection and Water Quality Detection solutions using Python, focusing on data processing, feature development, testing and integration of project components.',
      'Applied OpenCV, PyTorch, Google Earth Engine and web technologies for satellite image processing, flood change detection, interactive visualization and environmental data analysis.',
    ],
    tags: ['Python', 'OpenCV', 'PyTorch', 'Google Earth Engine'],
    visual: 'flood',
    image: '/images/projects/flood-water-quality.png',
    context: 'Internship work at Conzura Soft Solutions',
  },
]
