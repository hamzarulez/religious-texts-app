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

async function generateQuranContent(): Promise<void> {
  const outputDir = path.join(__dirname, '../static-content');
  
  console.log('📚 Reading Quran chapters...');
  const chapters = await fetchQuranData();
  
  if (chapters.length === 0) {
    console.warn('⚠️ No chapters were loaded from JSON files.');
    return;
  }

  // Create metadata with chapters information
  const quranMetadata = {
    title: "The Holy Quran",
    description: "The central religious text of Islam",
    language: "en",
    lastUpdated: new Date().toISOString(),
    totalChapters: 114,
    chapters: chapters.map(chapter => ({
      id: chapter.id,
      name: chapter.name,
      transliteration: chapter.transliteration,
      translation: chapter.translation,
      type: chapter.type,
      total_verses: chapter.total_verses
    }))
  };

  // Write metadata
  fs.writeFileSync(
    path.join(outputDir, 'islamic/quran/metadata.json'),
    JSON.stringify(quranMetadata, null, 2)
  );

  console.log('✅ Created Quran metadata');

  // Write individual chapter files
  for (const chapter of chapters) {
    fs.writeFileSync(
      path.join(outputDir, `islamic/quran/chapters/${chapter.id}.json`),
      JSON.stringify(chapter, null, 2)
    );
    console.log(`✅ Written chapter ${chapter.id}`);
  }
}

interface HadithMetadata {
  length: number;
  arabic: {
    title: string;
    author: string;
    introduction: string;
  };
  english: {
    title: string;
    author: string;
    introduction: string;
  };
}

interface Hadith {
  id: number;
  idInBook: number;
  chapterId: number;
  bookId: number;
  arabic: string;
  english: {
    narrator: string;
    text: string;
  };
}

interface HadithChapter {
  metadata: HadithMetadata;
  hadiths: Hadith[];
  chapter: {
    id: number;
    bookId: number;
    arabic: string;
    english: string;
  };
}

const HADITH_BOOKS = {
  abudawud: {
    id: "sunan_abudawud",
    title: "Sunan Abu Dawud",
    description: "One of the six major hadith collections (Kutub al-Sittah)",
    directory: "the_9_books"
  },
  bukhari: {
    id: "sahih_bukhari",
    title: "Sahih al-Bukhari",
    description: "The most authentic collection of Hadith, compiled by Imam Bukhari",
    directory: "the_9_books"
  },
  muslim: {
    id: "sahih_muslim",
    title: "Sahih Muslim",
    description: "One of the two most authentic hadith collections in Sunni Islam",
    directory: "the_9_books"
  },
  tirmidhi: {
    id: "jami_tirmidhi",
    title: "Jami at-Tirmidhi",
    description: "One of the six major hadith collections, noted for its focus on legal traditions",
    directory: "the_9_books"
  },
  ibnmajah: {
    id: "sunan_ibnmajah",
    title: "Sunan Ibn Majah",
    description: "One of the six major hadith collections of Sunni Islam",
    directory: "the_9_books"
  },
  nasai: {
    id: "sunan_nasai",
    title: "Sunan an-Nasa'i",
    description: "One of the six major hadith collections, known for its strict classification",
    directory: "the_9_books"
  },
  malik: {
    id: "muwatta_malik",
    title: "Muwatta Malik",
    description: "The earliest written collection of hadith and Islamic law",
    directory: "the_9_books"
  },
  nawawi40: {
    id: "nawawi_40",
    title: "Al-Arba'un Al-Nawawiyyah",
    description: "Imam Nawawi's collection of 40 fundamental hadiths covering the core principles of Islam",
    directory: "forties"
  },
  qudsi40: {
    id: "qudsi_40",
    title: "40 Hadith Qudsi",
    description: "A collection of 40 divine hadiths where Allah speaks through the Prophet Muhammad (ﷺ)",
    directory: "forties"
  },
  shahwaliullah40: {
    id: "shahwaliullah_40",
    title: "40 Hadith Shah Waliullah",
    description: "Shah Waliullah's collection of 40 important hadiths",
    directory: "forties"
  },
  riyad_assalihin: {
    id: "riyadus_salihin",
    title: "Riyad as-Salihin",
    description: "A compilation of authentic hadiths by Imam An-Nawawi",
    directory: "other_books"
  },
  aladab_almufrad: {
    id: "aladab_almufrad",
    title: "Al-Adab Al-Mufrad",
    description: "A collection of hadiths focusing on Islamic etiquette and manners, compiled by Imam Bukhari",
    directory: "other_books"
  },
  shamail_muhammadiyah: {
    id: "shamail_muhammadiyah",
    title: "Shama'il Muhammadiyah",
    description: "A collection describing the characteristics and manners of Prophet Muhammad (ﷺ), compiled by Imam Tirmidhi",
    directory: "other_books"
  },
  mishkat_almasabih: {
    id: "mishkat_almasabih",
    title: "Mishkat al-Masabih",
    description: "A expanded collection of hadith compiled by Al-Khatib Al-Tabrizi, building upon Masabih al-Sunnah",
    directory: "other_books"
  },
  bulugh_almaram: {
    id: "bulugh_almaram",
    title: "Bulugh al-Maram",
    description: "A collection of hadith pertaining to Islamic jurisprudence, compiled by Ibn Hajar al-Asqalani",
    directory: "other_books"
  }
};

async function processHadithBook(
  bookDirName: string,
  outputDir: string,
  bookInfo: typeof HADITH_BOOKS[keyof typeof HADITH_BOOKS]
): Promise<void> {
  console.log(`\n📚 Processing ${bookInfo.title}...`);
  
  const sourceDir = path.join(__dirname, `../hadith-json/db/by_chapter/${bookInfo.directory}/${bookDirName}`);
  const targetDir = path.join(outputDir, `islamic/hadith/${bookInfo.id}`);
  
  // Create directory structure
  fs.mkdirSync(path.join(targetDir, 'chapters'), { recursive: true });
  
  try {
    // Read and sort chapter files
    const files = fs.readdirSync(sourceDir)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('.json', ''));
        const numB = parseInt(b.replace('.json', ''));
        return numA - numB;
      });

    const chapters: HadithChapter[] = [];

    // Process each chapter file
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(sourceDir, file), 'utf8');
        if (content.trim()) {
          const chapterData: HadithChapter = JSON.parse(content);
          chapters.push(chapterData);
          console.log(`✅ Loaded ${bookInfo.id} chapter ${file}`);
        }
      } catch (err) {
        console.warn(`⚠️ Error processing ${bookInfo.id} ${file}:`, err);
      }
    }

    // Generate metadata
    const metadata = {
      id: bookInfo.id,
      title: bookInfo.title,
      description: bookInfo.description,
      language: "en",
      lastUpdated: new Date().toISOString(),
      totalChapters: chapters.length,
      chapters: chapters.map(chapter => ({
        id: chapter.chapter.id,
        title: chapter.chapter.english,
        arabicTitle: chapter.chapter.arabic,
        totalHadiths: chapter.metadata.length
      }))
    };

    // Write metadata
    fs.writeFileSync(
      path.join(targetDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Write chapter files
    for (const chapter of chapters) {
      const chapterContent = {
        id: chapter.chapter.id,
        title: chapter.chapter.english,
        arabicTitle: chapter.chapter.arabic,
        totalHadiths: chapter.metadata.length,
        hadiths: chapter.hadiths.map(hadith => ({
          id: hadith.id,
          numberInBook: hadith.idInBook,
          arabic: hadith.arabic,
          english: {
            narrator: hadith.english.narrator,
            text: hadith.english.text
          }
        }))
      };

      fs.writeFileSync(
        path.join(targetDir, `chapters/${chapter.chapter.id}.json`),
        JSON.stringify(chapterContent, null, 2)
      );
    }

    console.log(`✅ Generated ${bookInfo.title} content with ${chapters.length} chapters`);

  } catch (error) {
    console.error(`❌ Error processing ${bookInfo.title}:`, error);
  }
}

async function generateHadithContent(): Promise<void> {
  const outputDir = path.join(__dirname, '../static-content');
  
  // Process each hadith book
  for (const [dirName, bookInfo] of Object.entries(HADITH_BOOKS)) {
    await processHadithBook(dirName, outputDir, bookInfo);
  }
  
  console.log('\n✅ Completed generating all hadith content');
}

async function generateStaticContent(): Promise<void> {
  const outputDir = path.join(__dirname, '../static-content');
  
  console.log('🚀 Starting static content generation...');
  
  // Generate Quran content
  await generateQuranContent();
  
  // Generate Hadith content
  await generateHadithContent();
}

generateStaticContent().catch(console.error);
