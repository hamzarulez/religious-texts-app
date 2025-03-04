import * as admin from 'firebase-admin';
import { adminDb } from './firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

interface Verse {
  id: number;
  text: string;
  translation: string;
}

interface ChapterData {
  id: number;
  name: string;
  translation: string;
  total_verses: number;
  verses: Verse[];
}

async function uploadChapter(chapterNumber: string) {
  try {
    // Read the JSON file directly
    const filePath = path.join(__dirname, `../src/data/islamic/quran/chapters/${chapterNumber}.ts`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Convert the content to JSON by removing 'export default' and parsing
    const jsonContent = fileContent.replace(/export default/g, '').trim();
    const chapterData: ChapterData = JSON.parse(jsonContent);
    
    if (!chapterData) {
      console.error(`❌ Chapter ${chapterNumber} not found`);
      return;
    }

    // Create chapter info object
    const chapterInfo = {
      chapterNumber: parseInt(chapterNumber),
      name: chapterData.name,
      translation: chapterData.translation,
      totalVerses: chapterData.total_verses,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Log what we're uploading
    console.log('\n📤 Uploading Chapter Info:');
    console.log(JSON.stringify(chapterInfo, null, 2));

    // Upload chapter info
    await adminDb
      .collection('religious_texts')
      .doc('quran')
      .collection('chapters')
      .doc(chapterNumber)
      .set(chapterInfo);

    console.log('✅ Uploaded Chapter info');

    // Upload verses in batch
    const batch = adminDb.batch();
    console.log('\n📤 Uploading Verses:');
    
    chapterData.verses.forEach((verse: Verse) => {
      const verseRef = adminDb
        .collection('religious_texts')
        .doc('quran')
        .collection('chapters')
        .doc(chapterNumber)
        .collection('verses')
        .doc(verse.id.toString());
        
      const verseData = {
        number: verse.id,
        translation: verse.translation,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Log first and last verse as examples
      if (verse.id === 1 || verse.id === chapterData.verses.length) {
        console.log(`\nVerse ${verse.id}:`);
        console.log(JSON.stringify(verseData, null, 2));
      }
        
      batch.set(verseRef, verseData);
    });

    await batch.commit();
    console.log(`\n✅ Uploaded all ${chapterData.verses.length} verses for Chapter ${chapterNumber}`);
    console.log('✅ Upload completed successfully');
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

// Get chapter number from command line argument
const chapterNumber = process.argv[2];
if (!chapterNumber) {
  console.error('❌ Please provide a chapter number');
  console.log('Usage: npm run upload-chapter -- 100');
  process.exit(1);
}

uploadChapter(chapterNumber);
