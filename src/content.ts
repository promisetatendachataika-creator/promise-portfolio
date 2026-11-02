// Everything written on the site lives here, so it can be updated
// without touching the layout code.

export const contact = {
  email: 'promisetatendachataika@gmail.com',
  phone: '+263 78 257 3320',
  phoneHref: 'tel:+263782573320',
  whatsapp: 'https://wa.me/263782573320',
  github: 'https://github.com/promisetatendachataika-creator',
  linkedin: 'https://www.linkedin.com/in/promise-chataika-03178a335',
  cv: '/cv.pdf',
};

export type Project = {
  name: string;
  status: string;
  summary: string;
  details: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    name: 'Chats & Sons',
    status: 'Live, 2025 to now',
    summary:
      'Website and ordering system for Chats and Sons, my family’s carpentry and joinery workshop in Harare.',
    details: [
      'Customers browse boards, fittings and furniture, place an order and check on it later. The workshop manages the catalogue and incoming orders from an admin side, and there’s a chat page for questions.',
      'It also has a cutting list tool. You enter the parts for a job, like kitchen units or a wardrobe, and it works out how many 2750 × 1830 mm boards of each material to buy, with an allowance for waste.',
    ],
    stack: ['React', 'TypeScript', 'React Router', 'Firebase Auth', 'Firestore', 'Tailwind CSS'],
    links: [
      { label: 'Visit the site', href: 'https://chataika.web.app' },
      { label: 'Source code', href: 'https://github.com/promisetatendachataika-creator/chats-and-sons-app' },
    ],
  },
  {
    name: 'PAOZ Highfield Assembly',
    status: 'Live, 2026',
    summary: 'Website for PAOZ Highfield Assembly, a church in Harare.',
    details: [
      'Content is edited through an admin page I built, so updates don’t need a code change. Photos are stored in Firestore: Cloudinary isn’t available in Zimbabwe, and Firebase’s paid plan needs a bank card, so I worked within the free tier.',
    ],
    stack: ['Firebase Hosting', 'Firestore'],
    links: [{ label: 'Visit the site', href: 'https://paoz-highfield.web.app' }],
  },
  {
    name: 'Telecom Licence Regulator',
    status: 'Live demo',
    summary: 'A web app for managing telecom licence applications.',
    details: [
      'You can search and filter applications, compare licence types, adjust and track fees, and export the data to CSV. It can also write a compliance report on an application using Google’s Gemini API.',
    ],
    stack: ['React', 'TypeScript', 'Firestore', 'Gemini API'],
    links: [
      { label: 'Try the demo', href: 'https://telecomunication1.netlify.app' },
      { label: 'Source code', href: 'https://github.com/promisetatendachataika-creator/Telecom-Licence-Regulator' },
    ],
  },
  {
    name: 'Promota Chords',
    status: 'In testing',
    summary:
      'An Android app that listens to someone singing and tells you their key, so you can transpose on the keyboard.',
    details: [
      'I play keyboard for singers, and finding each person’s key by ear slows rehearsals down. Chord finding is the next feature I’m working on.',
    ],
    stack: ['Android'],
    links: [],
  },
];

export const smallerProjects = [
  {
    name: 'Bank account simulation',
    note: 'Python',
    href: 'https://github.com/promisetatendachataika-creator/BankAccountSimulation',
  },
  {
    name: 'Library management system',
    note: 'Python',
    href: 'https://github.com/promisetatendachataika-creator/LIBRARY-MANAGEMENT-SYSTEM',
  },
];

export const skills: { area: string; items: string }[] = [
  { area: 'Web', items: 'HTML, CSS, JavaScript, TypeScript, React, Tailwind CSS, Vite' },
  { area: 'Backend and data', items: 'Firebase (Auth, Firestore, Hosting), Python, Java' },
  { area: 'Networking', items: 'Network design and troubleshooting, Cisco Packet Tracer' },
  { area: 'Tools', items: 'Git and GitHub, Netlify' },
];

export const background: { title: string; detail: string }[] = [
  { title: 'BSc (Hons) Computer Science', detail: 'University of Zimbabwe, 2024 to 2028' },
  { title: 'CS50’s Introduction to Artificial Intelligence with Python', detail: 'HarvardX' },
  { title: 'Microsoft Skillsbox certification', detail: 'Microsoft' },
  {
    title: 'Community service',
    detail: 'Technical support and admin help at Raqual Junior School, as part of my degree',
  },
  { title: 'Languages', detail: 'English and Shona' },
];
