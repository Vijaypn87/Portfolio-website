import type { Project } from '@/types'

/**
 * The projects, in the order they are shown. A project with no `live` link shows no "Visit" button, and one with no `keyMetric` shows no stat, so
 * leave those fields out rather than writing a placeholder.
 */
export const projects: readonly Project[] = [
  {
    id: 'traceforge',
    name: 'TraceForge',
    category: 'RAG/LLM',
    status: 'live',
    oneLiner:
      'Record LLM agent runs once, then replay, fork, and diff them offline for developers.',
    image: { src: '/projects/traceforge.webp', width: 1600, height: 790 },
    description:
      "LLM agents are non-deterministic and expensive to re-run, which makes failures hard to reproduce and debug. I built TraceForge, a TypeScript library and CLI that records an agent's API calls and tool results into a SQLite journal and replays them byte-exact offline, with forking to explore alternate responses and diffing to find where runs diverge. The result reproduces agent crashes instantly with no API calls or token cost.",
    highlights: [
      'Recorded API calls via fetch injection into a content-addressed SQLite journal',
      'Replayed SSE streams with exact chunk boundaries, including mid-stream aborts',
      'Designed counterfactual forking and hybrid replay that produce replayable runs',
    ],
    keyMetric: '75 automated tests passing across 12 test files',
    tech: [
      'TypeScript',
      'Node.js',
      'SQLite',
      'Anthropic SDK (Claude API)',
      'Commander.js',
      'Vitest',
      'HTML/CSS',
    ],
    github: 'https://github.com/Vijaypn87/TraceForge',
    live: 'https://traceforgeai.vercel.app/',
  },
  {
    id: 'web-rag-evaluator',
    name: 'Web RAG Evaluator',
    category: 'RAG/LLM',
    status: 'live',
    oneLiner:
      'RAG app that answers questions about any webpage with verified, measurable citations.',
    image: { src: '/projects/web-rag-evaluator.webp', width: 1600, height: 646 },
    description:
      "Language models can give confident but unsupported answers, and RAG systems are usually configured by guesswork. I built a full-stack RAG app that answers from a webpage's content, cites and verifies its sources, and scores each answer on four quality metrics. A controlled 405-answer experiment showed that better retrieval did not improve answer correctness with a small model, and that the LLM judge mis-scored correct refusals.",
    highlights: [
      'Built a citation-checked RAG pipeline with FastAPI, ChromaDB and React',
      'Designed a four-metric evaluator; fixed a score-inflating citation bug',
      'Ran a 405-answer experiment comparing chunk size and top-k',
    ],
    keyMetric: 'Retrieval Hit@k improved from 0.69 to 1.00 across 405 judged answers',
    tech: [
      'Python',
      'FastAPI',
      'React',
      'TypeScript',
      'ChromaDB',
      'Ollama',
      'Google Gemini',
      'Render',
    ],
    github: 'https://github.com/Vijaypn87/Web-RAG-Evaluator',
    live: 'https://web-rag-evaluator-frontend.onrender.com',
  },
  {
    id: 'runledger',
    name: 'RunLedger',
    category: 'Developer Tools',
    status: 'live',
    oneLiner:
      'Local CLI that records AI coding-agent sessions into reviewable HTML audit reports for developers.',
    image: { src: '/projects/runledger.webp', width: 1600, height: 806 },
    description:
      'AI coding agents edit files and run commands with little visibility, making their work hard to review. I built a fully local CLI that records agent sessions, tracks commands, git changes and risky edits, and generates a self-contained HTML audit report. Developers can review exactly what an agent did before committing, with no cloud or telemetry.',
    highlights: [
      'Automatic session recording through Claude Code hooks integration',
      'Risk detection for secrets, dependencies, CI config, and migrations',
      'File-locked concurrent writes and staged/unstaged git diff capture',
    ],
    keyMetric: '68 automated unit and integration tests',
    tech: [
      'TypeScript',
      'Node.js',
      'Commander.js',
      'Git',
      'Vitest',
      'HTML/CSS',
      'Claude Code hooks',
    ],
    github: 'https://github.com/Vijaypn87/RunLedger',
    live: 'https://runledger-web.vercel.app/',
  },
  {
    id: 'visionguard-ai',
    name: 'VisionGuard AI',
    category: 'Computer Vision',
    status: 'building',
    oneLiner:
      'Tracks people and vehicles in surveillance video and flags anomalous activity for safety monitoring.',
    image: { src: '/projects/visionguard.webp', width: 1600, height: 1000 },
    coverIcon: 'eye',
    description:
      'Monitoring many surveillance feeds for unusual activity is hard to do manually. I built a pipeline that detects and tracks people and vehicles with YOLOv8 and ByteTrack, and scores video clips for anomalies using frozen VideoMAE features with a head trained by MIL ranking loss. Detection and tracking run end to end; anomaly-head training and UCF-Crime evaluation are implemented but not yet run.',
    highlights: [
      'Built YOLOv8 + ByteTrack pipeline for webcam, RTSP, and video-file input',
      'Implemented MIL ranking-loss training on frozen VideoMAE features for UCF-Crime',
      'Added UCF-Crime evaluation, 54 unit tests, CI, Docker, Streamlit dashboard',
    ],
    keyMetric: '~12 FPS detection + tracking on CPU (848×480 demo clip)',
    tech: ['Python', 'PyTorch', 'YOLOv8', 'ByteTrack', 'VideoMAE', 'OpenCV', 'Streamlit', 'Docker'],
    github: 'https://github.com/Vijaypn87/VisionGuard-AI',
  },
  {
    id: 'flood-detection-system',
    name: 'Flood Detection System',
    category: 'Data/Geospatial',
    status: 'live',
    oneLiner:
      'Web app that maps flood-affected areas in India from pre- and post-flood satellite images.',
    image: { src: '/projects/flood-detection.webp', width: 1600, height: 808 },
    coverIcon: 'waves',
    description:
      'Floods are hard to map with optical imagery because monsoon cloud cover blocks the view. I built a Flask web app that downloads Sentinel-1 SAR (radar) images from Google Earth Engine and compares pre-flood and post-flood scenes to detect flooded areas. The deployed app shows the flood extent on an interactive map, with inundation statistics for six Indian regions and for images users upload.',
    highlights: [
      'Built a Google Earth Engine pipeline to download Sentinel-1 SAR images',
      'Implemented OpenCV change detection with border masking and noise removal',
      'Shrank image data 195 MB → 6.3 MB, making analysis about 5× faster',
    ],
    keyMetric: '195 MB → 6.3 MB image data, ~5× faster analysis',
    tech: [
      'Python',
      'Flask',
      'OpenCV',
      'NumPy',
      'Google Earth Engine',
      'Leaflet',
      'JavaScript',
      'Render',
    ],
    github: 'https://github.com/Vijaypn87/Flood-Detection-System',
    live: 'https://flood-detection-system-m2iq.onrender.com/',
  },
  {
    id: 'terrapulse-ai',
    name: 'TerraPulse AI',
    category: 'Data/Geospatial',
    status: 'building',
    oneLiner:
      'Interactive environmental intelligence dashboard visualizing global air quality for curious citizens and researchers.',
    image: { src: '/projects/terrapulse.webp', width: 1600, height: 790 },
    description:
      'Environmental data is hard for non-experts to read and explore. I built a web platform with an interactive 3D globe, geospatial maps, dashboards, and pollution hotspot views, using bundled demo data that is clearly labeled. It is deployed on Cloudflare Workers, with a typed API layer ready for a future backend and ML forecasting service.',
    highlights: [
      'Built interactive 3D Earth with custom shaders using React Three Fiber',
      'Implemented MapLibre geospatial map with hotspot layers and location search',
      'Designed typed API layer with data-provenance labels (live/demo/model)',
    ],
    tech: [
      'React',
      'TypeScript',
      'TanStack Start',
      'Three.js',
      'React Three Fiber',
      'MapLibre GL',
      'Tailwind CSS',
      'Cloudflare Workers',
    ],
    github: 'https://github.com/Vijaypn87/TerraPulse-AI',
    live: 'https://vijaypn87-terrapulse-ai.terrapulseai.workers.dev/',
  },
  {
    id: 'namma-yojane',
    name: 'Namma Yojane',
    category: 'Full Stack',
    status: 'building',
    oneLiner:
      'Bilingual web app helping Karnataka residents find government schemes they may qualify for.',
    image: { src: '/projects/namma-yojane.webp', width: 1600, height: 808 },
    description:
      "Finding Karnataka government schemes you may qualify for is hard, and information is scattered. I built a bilingual (English/Kannada) React web app where people can browse schemes, answer a 5-step questionnaire, and get rule-based eligibility matches. It's deployed on GitHub Pages as a working prototype with sample scheme data, with a placeholder assistant for a planned AI feature.",
    highlights: [
      'Rule-based eligibility engine that excludes schemes failing any hard requirement',
      '5-step questionnaire, search and filters, and saved-scheme shortlist in React 19',
      'Automated GitHub Actions deployment to GitHub Pages with client-side routing support',
    ],
    tech: [
      'React 19',
      'Vite',
      'React Router',
      'Tailwind CSS',
      'JavaScript',
      'GitHub Actions',
      'GitHub Pages',
    ],
    github: 'https://github.com/Vijaypn87/Namma-Yojane-AI-scheme-Finder',
    live: 'https://vijaypn87.github.io/Namma-Yojane-AI-scheme-Finder/',
    comingNext: [
      'AI assistant answering scheme questions, including in Kannada',
      'Verified scheme data with official sources and last-verified dates',
      'Voice search in Kannada and English',
      'User accounts with synced saved schemes',
      'Full Kannada translation',
      'Alerts for new schemes and deadlines',
    ],
    upcomingSkills: [
      'LLM integration',
      'Serverless APIs',
      'Authentication',
      'Speech recognition',
      'Notifications',
    ],
  },
  {
    id: 'heart-disease-prediction',
    name: 'Heart Disease Prediction',
    category: 'AI/ML',
    status: 'completed',
    oneLiner:
      'Streamlit app that predicts heart disease risk from 13 clinical inputs for educational use.',
    image: { src: '/projects/heart-disease.webp', width: 1600, height: 1000 },
    coverIcon: 'heart-pulse',
    description:
      'Heart disease screening relies on reading many clinical measurements together, which makes it a good benchmark problem for machine learning. I built a Streamlit web app that trains and compares SVM, KNN, Decision Tree and XGBoost models on the 270-patient Statlog heart dataset and shows each prediction with its probabilities. The best model, SVM with feature scaling, reached 83.7% accuracy in 5-fold cross-validation.',
    highlights: [
      'Compared SVM, KNN, Decision Tree and XGBoost with 5-fold cross-validation',
      'Built scikit-learn pipelines with feature scaling for distance-based models',
      'Mapped clinical codes to labelled inputs and cached trained models',
    ],
    keyMetric: '83.7% 5-fold CV accuracy (SVM) on 270 patients',
    tech: ['Python', 'Streamlit', 'scikit-learn', 'XGBoost', 'pandas', 'NumPy', 'Matplotlib'],
    github: 'https://github.com/Vijaypn87/Heart-Disease-Predicition',
  },
]
