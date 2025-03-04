import * as admin from 'firebase-admin';
import { adminDb } from './firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

interface Verse {
  id: number;  // Changed from number to id
  text: string;
  translation: string;
}

interface Chapter {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
  verses: Verse[];
}

async function uploadQuranJson() {
  try {
    console.log('📖 Starting Quran upload...');

    // Upload main Quran document
    await adminDb.collection('religious_texts').doc('quran').set({
      title: 'The Holy Quran',
      description: "The central religious text of Islam",
      type: "scripture",
      religion: "Islam",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Uploaded main Quran document');

    const chaptersPath = path.join(__dirname, '../quran-json/dist/chapters/en');
    const files = fs.readdirSync(chaptersPath)
      .filter(file => file.endsWith('.json'));

    for (const file of files) {
      const chapterData: Chapter = JSON.parse(
        fs.readFileSync(path.join(chaptersPath, file), 'utf8')
      );

      console.log(`\n📤 Uploading Chapter ${chapterData.id}: ${chapterData.name}`);

      // Upload chapter info
      const chapterRef = adminDb
        .collection('religious_texts')
        .doc('quran')
        .collection('chapters')
        .doc(chapterData.id.toString());

      await chapterRef.set({
        chapterNumber: chapterData.id,
        name: chapterData.name,
        transliteration: chapterData.transliteration,
        translation: chapterData.translation,
        type: chapterData.type,
        totalVerses: chapterData.total_verses
      });

      // Upload verses in batches
      const batch = adminDb.batch();
      let batchCount = 0;

      for (const verse of chapterData.verses) {
        const verseRef = chapterRef.collection('verses').doc(verse.id.toString());
        batch.set(verseRef, {
          number: verse.id,  // Use verse.id instead of verse.number
          text: verse.text,
          translation: verse.translation
        });

        batchCount++;
        if (batchCount >= 500) { // Firestore batch limit
          await batch.commit();
          console.log(`✅ Committed batch of ${batchCount} verses`);
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
        console.log(`✅ Committed final batch of ${batchCount} verses`);
      }

      console.log(`✅ Completed Chapter ${chapterData.id}`);
    }

    console.log('\n✅ Successfully uploaded all Quran data');
  } catch (error) {
    console.error('❌ Error uploading Quran:', error);
    throw error;
  }
}

uploadQuranJson().catch(console.error);
