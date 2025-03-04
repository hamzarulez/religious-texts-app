export const christianTextsRegistry = {
  'bible': () => import('../christian/bible'),
  'confessions': () => import('../christian/confessions'),
  'summa': () => import('../christian/summa'),
  // Add more Christian texts as needed
} as const;
