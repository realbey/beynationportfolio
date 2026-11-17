// Sample content. Used when Supabase is not configured, and as defaults for any
// setting that is missing in the database. Replace these with your own details.

export const SITE_DEFAULTS = {
  brand: 'BEYNATION',
  owner_name: 'Your Name',
  role: 'Full-Stack & Mobile Developer',
  availability: 'Open to internships and freelance work',
  hero_intro:
    'I design and build fast, good-looking websites and mobile apps with React Native, Expo and Supabase. I like projects that solve one real problem well.',
  hero_phrases: [
    'responsive websites.',
    'mobile apps with React Native.',
    'database-backed systems.',
    'clean, fast interfaces.',
  ],
  marquee: [
    'React Native',
    'Expo',
    'JavaScript',
    'Supabase',
    'PostgreSQL',
    'Reanimated',
    'Expo Router',
    'Git & GitHub',
    'REST APIs',
    'Netlify',
  ],
  about_bio: [
    'I am a self-taught developer who started with HTML and CSS and kept going: JavaScript, then React Native and Expo, then databases and authentication with Supabase. I learn by building complete systems, not isolated exercises.',
    'My projects so far are management systems for schools, shops and gaming communities. Each one taught me something new about data modelling, permissions and making an app feel simple for the people who use it every day.',
  ],
  journey: [
    { year: '2023', title: 'First lines of code', text: 'Started with HTML, CSS and JavaScript through free courses and small practice pages.' },
    { year: '2024', title: 'Moved to React Native', text: 'Built my first mobile screens with Expo and learned navigation, state and layout.' },
    { year: '2025', title: 'Databases and auth', text: 'Added Supabase, PostgreSQL and role-based access to real management systems.' },
    { year: '2026', title: 'Shipping and polishing', text: 'Focusing on performance, animation, security basics and a portfolio worth sharing.' },
  ],
  goals: [
    { icon: 'rocket', title: 'Land a junior developer role', text: 'Join a team that reviews code and mentors early-career engineers.' },
    { icon: 'shield-checkmark', title: 'Master app security', text: 'Go deeper on row-level security, auth flows and safe data handling.' },
    { icon: 'flash', title: 'Build faster apps', text: 'Learn profiling, caching and animation performance on low-end Android phones.' },
  ],
  interests: [
    'Mobile app development',
    'UI motion and 3D interaction',
    'Backend and database design',
    'Developer tooling',
    'Open source',
    'Teaching and sharing notes',
  ],
  values: [
    { icon: 'checkmark-done', title: 'Reliability', text: 'Software people can depend on, with sensible errors and no surprises.' },
    { icon: 'people', title: 'Clear communication', text: 'Short updates, honest estimates and questions asked early.' },
    { icon: 'sparkles', title: 'Craft', text: 'Details matter: spacing, motion, copy and edge cases.' },
    { icon: 'school', title: 'Always learning', text: 'Every project ends with a note on what to do better next time.' },
  ],
  contact_blurb:
    'Have a website, app or system in mind? Send a message and I will reply within a couple of days.',
  social_whatsapp: '255700000000',
  social_github: 'https://github.com/your-username',
  social_linkedin: 'https://www.linkedin.com/in/your-username',
  social_twitter: 'https://x.com/your-username',
  social_instagram: 'https://www.instagram.com/your-username',
  social_email: 'hello@yourname.dev',
};

export const SAMPLE_PROJECTS = [
  {
    id: 'school-management-system',
    slug: 'school-management-system',
    title: 'School Management System',
    tagline: 'Students, teachers, fees and results in one place.',
    description:
      'A system for running the daily work of a school: enrolling students, assigning teachers to classes, recording attendance and exam marks, and tracking fee payments.\n\nBuilt as a mobile-first app with role-based access, so administrators, teachers and parents each see only what they should.',
    category: 'Education',
    tags: ['React Native', 'Expo', 'Supabase', 'PostgreSQL'],
    highlights: [
      'Student and teacher records',
      'Class and subject management',
      'Fee tracking with payment history',
      'Exam results and report cards',
      'Role-based access for admin, teacher and parent',
    ],
    images: [
      { gradient: ['#0B5FFF', '#00F0FF'], icon: 'school', caption: 'Dashboard overview' },
      { gradient: ['#0A2A66', '#38BDF8'], icon: 'people', caption: 'Student records' },
      { gradient: ['#06324A', '#00F0FF'], icon: 'document-text', caption: 'Report cards' },
    ],
    github_url: 'https://github.com/your-username/school-management-system',
    demo_url: '',
    featured: true,
  },
  {
    id: 'stationery-management-system',
    slug: 'stationery-management-system',
    title: 'Stationery Management System',
    tagline: 'Stock, sales and suppliers for a stationery shop.',
    description:
      'A point-of-sale and inventory app for a small stationery shop. The owner can add products, record sales, see what is running low and review daily takings.\n\nDesigned to work well on a phone behind the counter, with large tap targets and quick search.',
    category: 'Business',
    tags: ['React Native', 'Expo', 'Supabase', 'Reports'],
    highlights: [
      'Product catalogue with categories and prices',
      'Quick sales entry and receipts',
      'Low-stock alerts',
      'Supplier and purchase records',
      'Daily and monthly sales summaries',
    ],
    images: [
      { gradient: ['#0B5FFF', '#38BDF8'], icon: 'storefront', caption: 'Sales screen' },
      { gradient: ['#082F49', '#00F0FF'], icon: 'cube', caption: 'Inventory list' },
      { gradient: ['#0A2A66', '#00F0FF'], icon: 'bar-chart', caption: 'Sales reports' },
    ],
    github_url: 'https://github.com/your-username/stationery-management-system',
    demo_url: '',
    featured: true,
  },
  {
    id: 'efootball-gamers-system',
    slug: 'efootball-gamers-system',
    title: 'eFootball Gamers System',
    tagline: 'Players, fixtures, tables and tournament results.',
    description:
      'A community app for eFootball players. Organisers can register players, generate fixtures, record match results and publish league tables and rankings.\n\nPlayers get a simple profile with their match history and stats.',
    category: 'Gaming',
    tags: ['React Native', 'Expo', 'Supabase', 'Realtime'],
    highlights: [
      'Player registration and profiles',
      'Fixture generation for leagues and knockouts',
      'Live league table and rankings',
      'Match history and player stats',
      'Organiser dashboard for results',
    ],
    images: [
      { gradient: ['#0B5FFF', '#00F0FF'], icon: 'game-controller', caption: 'Tournament home' },
      { gradient: ['#06324A', '#38BDF8'], icon: 'trophy', caption: 'League table' },
      { gradient: ['#0A2A66', '#38BDF8'], icon: 'people', caption: 'Player profiles' },
    ],
    github_url: 'https://github.com/your-username/efootball-gamers-system',
    demo_url: '',
    featured: true,
  },
];

export const SAMPLE_SKILLS = [
  { id: 's1', category: 'Frontend', name: 'HTML5', level: 90, icon: 'logo-html5' },
  { id: 's2', category: 'Frontend', name: 'CSS3', level: 85, icon: 'logo-css3' },
  { id: 's3', category: 'Frontend', name: 'JavaScript', level: 80, icon: 'logo-javascript' },
  { id: 's4', category: 'Mobile', name: 'React Native', level: 78, icon: 'logo-react' },
  { id: 's5', category: 'Mobile', name: 'Expo', level: 80, icon: 'phone-portrait' },
  { id: 's6', category: 'Mobile', name: 'Expo Router', level: 72, icon: 'git-network' },
  { id: 's7', category: 'Backend & Data', name: 'Supabase', level: 72, icon: 'server' },
  { id: 's8', category: 'Backend & Data', name: 'PostgreSQL', level: 66, icon: 'server' },
  { id: 's9', category: 'Backend & Data', name: 'REST APIs', level: 68, icon: 'cloud-upload' },
  { id: 's10', category: 'Tools', name: 'Git & GitHub', level: 76, icon: 'logo-github' },
  { id: 's11', category: 'Tools', name: 'VS Code', level: 88, icon: 'code-slash' },
  { id: 's12', category: 'Tools', name: 'Netlify', level: 70, icon: 'rocket' },
];

export const SAMPLE_SERVICES = [
  {
    id: 'sv1',
    title: 'Website Development',
    icon: 'globe',
    description: 'Fast, responsive websites for businesses, schools and personal brands.',
    features: ['Mobile-first design', 'Contact forms and social links', 'Deployed on Netlify', 'Basic SEO setup'],
  },
  {
    id: 'sv2',
    title: 'Mobile App Development',
    icon: 'phone-portrait',
    description: 'Android-ready apps built with React Native and Expo, with smooth animation.',
    features: ['Clean navigation', 'Offline-friendly screens', 'Push-ready architecture', 'Play Store guidance'],
  },
  {
    id: 'sv3',
    title: 'Portfolio Creation',
    icon: 'color-palette',
    description: 'A portfolio that shows your work clearly and looks like you took it seriously.',
    features: ['Custom visual style', 'Project showcase pages', 'Easy to update', 'Works on phone and desktop'],
  },
  {
    id: 'sv4',
    title: 'Database-Backed Apps',
    icon: 'server',
    description: 'Management systems with logins, roles and reports, powered by Supabase.',
    features: ['Schema design', 'Row-level security', 'Admin dashboards', 'Backups and migration help'],
  },
];
