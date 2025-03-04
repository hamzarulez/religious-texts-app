import * as fs from 'fs';
import * as path from 'path';

interface QuranVerse {
  id: number;
  text: string;
  translation: string;
}

interface QuranChapter {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
  verses: QuranVerse[];
}

async function fetchQuranData(): Promise<QuranChapter[]> {
  const chapters: QuranChapter[] = [];
  console.log('Reading Quran JSON files...');
  
  try {
    // Update the path to your actual Quran chapters location
    const chaptersPath = path.join(__dirname, '../quran-json/quran-chapters');
    const files = fs.readdirSync(chaptersPath)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('.json', ''));
        const numB = parseInt(b.replace('.json', ''));
        return numA - numB;
      });

    for (const file of files) {
      const chapterData: QuranChapter = JSON.parse(
        fs.readFileSync(path.join(chaptersPath, file), 'utf8')
      );
      
      // Validate chapter data
      if (chapterData && chapterData.id && chapterData.name) {
        chapters.push(chapterData);
        console.log(`✅ Loaded chapter ${chapterData.id}: ${chapterData.name}`);
      } else {
        console.warn(`⚠️ Skipped invalid chapter data in file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error reading Quran JSON files:', error);
  }

  return chapters;
}

async function generateStaticContent(): Promise<void> {
  const outputDir = path.join(__dirname, '../static-content');
  
  console.log('🚀 Starting static content generation...');
  
  // Clear existing content
  if (fs.existsSync(outputDir)) {
    console.log('Cleaning existing content...');
    fs.rmSync(outputDir, { recursive: true });
  }

  // Create base directory structure
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'islamic/quran/chapters'), { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'islamic/hadith/collections'), { recursive: true });

  // Generate index file
  const indexContent = {
    title: "Religious Texts Repository",
    description: "A comprehensive collection of religious texts",
    religions: ["islamic"],
    lastUpdated: new Date().toISOString(),
    version: "1.0.0"
  };

  fs.writeFileSync(
    path.join(outputDir, 'index.json'),
    JSON.stringify(indexContent, null, 2)
  );

  console.log('✅ Created index.json');

  // Generate Quran metadata
  const quranMetadata = {
    title: "The Holy Quran",
    description: "The central religious text of Islam",
    language: "en",
    lastUpdated: new Date().toISOString(),
    totalChapters: 114
  };

  fs.writeFileSync(
    path.join(outputDir, 'islamic/quran/metadata.json'),
    JSON.stringify(quranMetadata, null, 2)
  );

  console.log('✅ Created Quran metadata');

  // Fetch and write Quran chapters
  console.log('📚 Reading Quran chapters...');
  const chapters = await fetchQuranData();
  
  if (chapters.length === 0) {
    console.warn('⚠️ No chapters were loaded from JSON files.');
    return;
  }

  // Write chapters index
  const chaptersIndex = chapters
    .filter(chapter => chapter && chapter.id) // Additional validation
    .map(chapter => ({
      id: chapter.id.toString(),
      chapterNumber: chapter.id,
      name: chapter.name,
      transliteration: chapter.transliteration,
      translation: chapter.translation,
      type: chapter.type,
      totalVerses: chapter.total_verses
    }));

  fs.writeFileSync(
    path.join(outputDir, 'islamic/quran/chapters-index.json'),
    JSON.stringify(chaptersIndex, null, 2)
  );

  console.log('✅ Created chapters index');

  // Write individual chapter files
  for (const chapter of chapters) {
    if (!chapter || !chapter.id) continue; // Skip invalid chapters

    const formattedChapter = {
      id: chapter.id.toString(),
      chapterNumber: chapter.id,
      name: chapter.name,
      transliteration: chapter.transliteration,
      translation: chapter.translation,
      type: chapter.type,
      totalVerses: chapter.total_verses,
      verses: chapter.verses.map(verse => ({
        number: verse.id,
        text: verse.text,
        translation: verse.translation
      }))
    };

    const chapterPath = path.join(outputDir, 'islamic/quran/chapters', `${chapter.id}.json`);
    fs.writeFileSync(chapterPath, JSON.stringify(formattedChapter, null, 2));
    console.log(`✅ Written chapter ${chapter.id}: ${chapter.transliteration}`);
  }

  console.log('✅ Static content generated successfully');
}

generateStaticContent().catch(console.error);
