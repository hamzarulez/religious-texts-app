import * as admin from 'firebase-admin';
import { adminDb } from './firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

interface Hadith {
  id: number;
  idInBook?: number;
  narrator?: string;
  text: string;
  arabic?: string;
  english?: {
    narrator?: string;
    text: string;
  };
}

interface Chapter {
  id: number;
  bookId: number;
  arabic?: string;
  english: string;
  hadiths: Hadith[];
}

interface HadithBook {
  metadata: {
    length: number;
    arabic?: {
      title: string;
      author: string;
      introduction?: string;
    };
    english: {
      title: string;
      author: string;
      introduction?: string;
    };
  };
  chapter: {
    id: number;
    bookId: number;
    arabic?: string;
    english: string;
  };
  hadiths: Hadith[];  // Changed: moved hadiths array to root level
}

function cleanJsonContent(content: string): string {
  // Remove BOM and other special Unicode characters
  return content
    .replace(/[\u200B-\u200F\uFEFF]/g, '') // Remove zero-width spaces and directional marks
    .trim();
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed, retrying in ${delayMs}ms...`);
      await delay(delayMs);
      // Exponential backoff
      delayMs *= 2;
    }
  }
  throw lastError;
}

async function setWithTimeout(ref: any, data: any, timeoutMs = 60000): Promise<void> {
  return Promise.race([
    ref.set(data),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Firestore operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

// Add this helper function to chunk the array
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function uploadHadithJson() {
  console.log('Script started...');
  
  try {
    console.log('📚 Starting Hadith collections upload...');

    const hadithBooks = [
      {
        id: 'sahih_bukhari',
        path: 'hadith-json/db/by_chapter/the_9_books/bukhari'
      }
    ]; // Let's start with just one book to debug

    const projectRoot = path.resolve(__dirname, '..');

    for (const book of hadithBooks) {
      const bookPath = path.join(projectRoot, book.path);
      console.log(`\n📖 Processing ${book.id}...`);
      console.log(`Path: ${bookPath}`);
      
      if (!fs.existsSync(bookPath)) {
        console.log(`❌ Directory not found: ${bookPath}`);
        continue;
      }

      const dirContents = fs.readdirSync(bookPath);
      console.log(`Found files:`, dirContents);

      const chapterFiles = dirContents
        .filter(file => file.endsWith('.json'))
        .sort((a, b) => {
          const numA = parseInt(a.replace('.json', ''));
          const numB = parseInt(b.replace('.json', ''));
          return numA - numB;
        });

      console.log(`📑 Found ${chapterFiles.length} chapter files`);

      // Create the main hadith book document
      const bookRef = adminDb.collection('religious_texts').doc(book.id);
      
      // Process first chapter for metadata
      const firstChapterPath = path.join(bookPath, chapterFiles[0]);
      
      try {
        const rawContent = fs.readFileSync(firstChapterPath, 'utf8');
        const cleanContent = cleanJsonContent(rawContent);
        const firstChapter: HadithBook = JSON.parse(cleanContent);

        await retryOperation(() => 
          setWithTimeout(bookRef, {
            title: firstChapter.metadata.english.title,
            author: firstChapter.metadata.english.author,
            description: `Collection of hadiths compiled by ${firstChapter.metadata.english.author}`,
            type: "hadith",
            religion: "Islam",
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          })
        );

        console.log('✅ Created main book document');
        await delay(2000);

        // Process chapters in batches of 20
        const chapterBatches = chunkArray(chapterFiles, 20);
        console.log(`Divided chapters into ${chapterBatches.length} batches of 20`);

        for (let batchIndex = 0; batchIndex < chapterBatches.length; batchIndex++) {
          const chapterBatch = chapterBatches[batchIndex];
          console.log(`\n📦 Processing batch ${batchIndex + 1} of ${chapterBatches.length}`);
          console.log(`Chapters in this batch: ${chapterBatch.map(f => f.replace('.json', '')).join(', ')}`);

          for (const file of chapterBatch) {
            const chapterNumber = parseInt(file.replace('.json', ''));
            console.log(`\n📤 Starting Chapter ${chapterNumber} (${file})`);

            try {
              const rawChapterContent = fs.readFileSync(path.join(bookPath, file), 'utf8');
              const cleanChapterContent = cleanJsonContent(rawChapterContent);
              const chapterData: HadithBook = JSON.parse(cleanChapterContent);

              const chapterRef = bookRef.collection('chapters').doc(chapterNumber.toString());
              
              const chapterMetadata = {
                chapterNumber,
                title: chapterData.chapter.english,
                arabicTitle: chapterData.chapter.arabic,
                totalHadiths: chapterData.metadata.length,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
              };

              await retryOperation(() => 
                setWithTimeout(chapterRef, chapterMetadata)
              );
              console.log('Chapter metadata uploaded successfully');
              await delay(1000);

              // Upload hadiths in smaller batches
              let batch = adminDb.batch();
              let batchCount = 0;
              let totalHadithsUploaded = 0;
              let currentBatch = 1;

              for (const hadith of chapterData.hadiths) {
                const hadithRef = chapterRef.collection('hadiths').doc(hadith.id.toString());
                const hadithData = {
                  number: hadith.id,
                  numberInBook: hadith.idInBook,
                  narrator: hadith.english?.narrator || '',
                  text: hadith.english?.text || '',
                  arabicText: hadith.arabic || '',
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                };

                batch.set(hadithRef, hadithData);
                batchCount++;
                totalHadithsUploaded++;

                if (batchCount >= 200) {
                  console.log(`Committing batch ${currentBatch} (${batchCount} hadiths)...`);
                  await retryOperation(() => 
                    setWithTimeout(batch.commit(), null)
                  );
                  console.log(`Batch ${currentBatch} committed successfully`);
                  await delay(1000);
                  batch = adminDb.batch();
                  batchCount = 0;
                  currentBatch++;
                }
              }

              if (batchCount > 0) {
                console.log(`Committing final batch ${currentBatch} (${batchCount} hadiths)...`);
                await retryOperation(() => 
                  setWithTimeout(batch.commit(), null)
                );
                console.log(`Final batch ${currentBatch} committed successfully`);
              }

              console.log(`✅ Completed Chapter ${chapterNumber}: ${totalHadithsUploaded} hadiths uploaded`);
              await delay(2000);
            } catch (error) {
              console.error(`❌ Error processing chapter ${file}:`, error);
              if (error instanceof Error) {
                console.error('Error details:', {
                  message: error.message,
                  stack: error.stack
                });
              }
              await delay(5000);
              continue;
            }
          }

          console.log(`\n✅ Completed batch ${batchIndex + 1}`);
          console.log('Waiting 10 seconds before processing next batch...');
          await delay(10000); // 10 second delay between batches of 20 chapters
        }

      } catch (error) {
        console.error(`❌ Error processing book ${book.id}:`, error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack
          });
        }
        continue;
      }
    }

    console.log('\n✅ Successfully uploaded all Hadith collections');
  } catch (error) {
    console.error('❌ Error uploading Hadith collections:', error);
    throw error;
  }
}

// Immediately invoked async function to handle the promise
(async () => {
  console.log('Starting script execution...');
  try {
    await uploadHadithJson();
    console.log('Script completed successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Script failed:', error.message);
    } else {
      console.error('Script failed with unknown error:', error);
    }
    process.exit(1);
  }
})();
