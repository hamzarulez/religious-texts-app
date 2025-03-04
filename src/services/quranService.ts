import { StorageService } from './storageService';

const storage = new StorageService();

export interface QuranChapter {
  chapterNumber: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  totalVerses: number;
}

export interface QuranVerse {
  number: number;
  text: string;
  translation: string;
}

export const getQuranChapters = async (): Promise<QuranChapter[]> => {
  try {
    console.log('Fetching Quran chapters...');
    const metadata = await storage.getMetadata('islamic', 'quran');
    console.log('Received metadata:', metadata);
    
    if (!metadata || !metadata.chapters) {
      console.warn('No chapters found in metadata');
      return [];
    }

    return metadata.chapters.map(chapter => ({
      chapterNumber: chapter.id,
      name: chapter.name,
      transliteration: chapter.transliteration,
      translation: chapter.translation,
      type: chapter.type,
      totalVerses: chapter.total_verses
    }));
  } catch (error) {
    console.error('Error fetching Quran chapters:', error);
    return [];
  }
};

export const getChapterVerses = async (chapterId: string | number): Promise<QuranVerse[]> => {
  try {
    console.log(`Fetching verses for chapter ${chapterId}...`);
    const chapterData = await storage.getContent('islamic', 'quran', String(chapterId));
    console.log('Received chapter data:', chapterData);
    
    if (!chapterData || !chapterData.verses) {
      console.log(`No verses found for chapter ${chapterId}`);
      return [];
    }

    return chapterData.verses.map((verse: any, index: number) => ({
      number: verse.number || index + 1,
      text: verse.text || '', // Arabic text
      translation: verse.translation || ''
    }));
  } catch (error) {
    console.error('Error fetching verses:', error);
    return [];
  }
};

export const getVerseByNumber = async (chapterId: string, verseNumber: string): Promise<QuranVerse | null> => {
  try {
    const verses = await getChapterVerses(chapterId);
    return verses.find(verse => verse.number === parseInt(verseNumber, 10)) || null;
  } catch (error) {
    console.error('Error fetching verse:', error);
    return null;
  }
};
