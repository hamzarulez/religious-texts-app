import { StorageService } from '../src/services/storageService';
import { DatabaseService } from '../src/services/dbService';
import { TextMetadata } from '../src/models/schemas';

async function uploadReligiousTexts() {
  const storage = new StorageService();
  const db = new DatabaseService();
  await db.connect();

  try {
    // Example: Upload Quran chapter
    const chapterContent = {/* your chapter data */};
    const chapterNumber = 1;
    
    // Upload content to R2
    const contentUrl = await storage.uploadContent(
      `quran/chapters/${chapterNumber}`,
      chapterContent
    );

    // Save metadata to MongoDB
    const metadata: TextMetadata = {
      religion: 'islam',
      bookId: 'quran',
      type: 'scripture',
      chapterNumber,
      title: 'Al-Fatiha',
      description: 'The Opening',
      versesCount: chapterContent.verses.length,
      contentUrl,
      language: 'en',
      updatedAt: new Date()
    };

    await db.saveTextMetadata(metadata);
    console.log(`✅ Uploaded chapter ${chapterNumber}`);
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}