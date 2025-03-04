import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, where, limit } from 'firebase/firestore';

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

// Get all chapters
export const getQuranChapters = async (): Promise<QuranChapter[]> => {
  try {
    console.log('Fetching Quran chapters from Firestore...');
    const chaptersRef = collection(db, 'religious_texts', 'quran', 'chapters');
    const q = query(chaptersRef, orderBy('chapterNumber'));
    const snapshot = await getDocs(q);
    
    console.log('Firestore response:', snapshot.docs.length, 'chapters found');
    
    if (snapshot.empty) {
      console.warn('No chapters found in Firestore');
      return [];
    }

    const chapters = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Chapter data:', data); // Add this debug log
      return {
        id: doc.id,
        chapterNumber: data.chapterNumber,
        name: data.name,
        transliteration: data.transliteration,
        translation: data.translation,
        type: data.type,
        totalVerses: data.totalVerses
      } as QuranChapter;
    });

    console.log('Processed chapters:', chapters.length); // Add this debug log
    return chapters;
  } catch (error) {
    console.error('Error fetching Quran chapters:', error);
    throw error;
  }
};

// Get a specific chapter by number
export const getChapterById = async (chapterNumber: string): Promise<QuranChapter | null> => {
  try {
    const chapterRef = doc(db, 'religious_texts', 'quran', 'chapters', chapterNumber);
    const chapterDoc = await getDoc(chapterRef);
    
    if (!chapterDoc.exists()) {
      return null;
    }
    
    return {
      id: chapterDoc.id,
      ...chapterDoc.data()
    } as QuranChapter;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    throw error;
  }
};

// Get verses for a specific chapter
export const getChapterVerses = async (chapterId: string | number): Promise<QuranVerse[]> => {
  try {
    // Convert chapterId to string if it's a number
    const chapterIdStr = String(chapterId);
    
    // Ensure the path is correct and properly formatted
    const versesRef = collection(db, 'religious_texts', 'quran', 'chapters', chapterIdStr, 'verses');
    const q = query(versesRef, orderBy('number'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`No verses found for chapter ${chapterIdStr}`);
      return [];
    }

    const verses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      number: parseInt(doc.id, 10) // Ensure number is parsed as integer
    })) as QuranVerse[];

    console.log(`Successfully fetched ${verses.length} verses for chapter ${chapterIdStr}`);
    return verses;
  } catch (error) {
    console.error('Error fetching verses:', error);
    // Return empty array instead of throwing
    return [];
  }
};

// Get a specific verse by chapter and verse number
export const getVerseByNumber = async (chapterId: string, verseNumber: string): Promise<QuranVerse | null> => {
  try {
    const verseRef = doc(db, 'religious_texts', 'quran', 'chapters', chapterId, 'verses', verseNumber);
    const verseDoc = await getDoc(verseRef);
    
    if (!verseDoc.exists()) {
      return null;
    }
    
    return {
      id: verseDoc.id,
      ...verseDoc.data()
    } as QuranVerse;
  } catch (error) {
    console.error('Error fetching verse:', error);
    throw error;
  }
};

// Search chapters by type (meccan/medinan)
export const getChaptersByType = async (type: string): Promise<QuranChapter[]> => {
  try {
    const chaptersRef = collection(db, 'religious_texts', 'quran', 'chapters');
    const q = query(chaptersRef, where('type', '==', type), orderBy('chapterNumber'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as QuranChapter[];
  } catch (error) {
    console.error('Error fetching chapters by type:', error);
    throw error;
  }
};
