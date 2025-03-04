export const islamicTextsRegistry = {
  'quran': async () => {
    const { getQuranChapters } = await import('../../services/quranService');
    const chapters = await getQuranChapters();
    return {
      info: {
        title: "The Holy Quran",
        description: "The central religious text of Islam",
        type: "scripture",
        religion: "Islam"
      },
      chapters
    };
  },
  // Hadith Collections
  'sahih_bukhari': () => import('../islamic/hadith/sahihain/bukhari'),
  'sahih_muslim': () => import('../islamic/hadith/sahihain/muslim'),
  'sunan_abu_dawood': () => import('../islamic/hadith/sunan/abu-dawood'),
  'sunan_tirmidhi': () => import('../islamic/hadith/sunan/tirmidhi'),
} as const;
