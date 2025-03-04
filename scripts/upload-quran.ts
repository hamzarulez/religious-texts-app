import * as admin from 'firebase-admin';
import { adminDb } from './firebase-admin';
import quranData from '../src/data/islamic/quran';
import chapter1 from '../src/data/islamic/quran/chapters/1';
import chapter2 from '../src/data/islamic/quran/chapters/2';

async function uploadQuran() {
  try {
    // Upload main Quran document
    await adminDb.collection('religious_texts').doc('quran').set({
      ...quranData.info,
      totalChapters: quranData.chapters.length,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Uploaded Quran info');

    // Upload chapters
    const chapters = [chapter1, chapter2];
    
    for (const chapter of chapters) {
      await adminDb
        .collection('religious_texts')
        .doc('quran')
        .collection('chapters')
        .doc(chapter.id)
        .set({
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          description: chapter.description,
          totalVerses: chapter.verses.length,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      // Upload verses in batches
      const batch = adminDb.batch();
      chapter.verses.forEach((verse) => {
        const verseRef = adminDb
          .collection('religious_texts')
          .doc('quran')
          .collection('chapters')
          .doc(chapter.id)
          .collection('verses')
          .doc(verse.number.toString());
          
        batch.set(verseRef, {
          number: verse.number,
          text: verse.text,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      console.log(`✅ Uploaded Chapter ${chapter.chapterNumber}`);
    }

    console.log('✅ Upload completed successfully');
  } catch (error) {
    console.error('❌ Error uploading data:', error);
  }
}

uploadQuran();
