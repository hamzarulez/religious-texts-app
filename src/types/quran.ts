export interface QuranVerse {
  number: number;
  text: string;
  translation: string;
}

export interface QuranChapter {
  chapterNumber: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  totalVerses: number;
  verses?: QuranVerse[];
}
