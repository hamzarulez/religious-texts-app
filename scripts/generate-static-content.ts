import * as fs from 'fs';
import * as path from 'path';
import quranData from '../src/data/islamic/quran';

interface ContentMetadata {
  title: string;
  description: string;
  language: string;
  lastUpdated: string;
  totalItems: number;
}

async function generateStaticContent() {
  const outputDir = path.join(__dirname, '../static-content');
  
  // Clear existing content
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }

  // Create base directory structure
  const structure = {
    islamic: {
      quran: {
        chapters: {},
        metadata: {
          title: "The Holy Quran",
          description: "The central religious text of Islam",
          language: "en",
          lastUpdated: new Date().toISOString(),
          totalChapters: quranData.chapters.length
        }
      },
      hadith: {
        collections: {},
        metadata: {
          title: "Hadith Collections",
          description: "Collections of traditions containing sayings of the prophet Muhammad",
          language: "en",
          lastUpdated: new Date().toISOString(),
          totalCollections: 6
        }
      }
    },
    christian: {
      bible: {
        books: {},
        metadata: {
          title: "The Holy Bible",
          description: "The central text of Christianity",
          language: "en",
          lastUpdated: new Date().toISOString(),
          totalBooks: 66
        }
      }
    },
    judaic: {
      torah: {
        books: {},
        metadata: {
          title: "The Torah",
          description: "The central text of Judaism",
          language: "en",
          lastUpdated: new Date().toISOString(),
          totalBooks: 5
        }
      }
    }
  };

  // Create directories and metadata files
  function createStructure(obj: any, currentPath: string) {
    Object.entries(obj).forEach(([key, value]: [string, any]) => {
      const fullPath = path.join(outputDir, currentPath, key);
      
      if (key === 'metadata') {
        // Write metadata file
        fs.writeFileSync(
          path.join(path.dirname(fullPath), 'metadata.json'),
          JSON.stringify(value, null, 2)
        );
      } else if (typeof value === 'object') {
        // Create directory
        fs.mkdirSync(fullPath, { recursive: true });
        createStructure(value, path.join(currentPath, key));
      }
    });
  }

  createStructure(structure, '');

  // Generate index file
  const indexContent = {
    title: "Religious Texts Repository",
    description: "A comprehensive collection of religious texts",
    religions: Object.keys(structure),
    lastUpdated: new Date().toISOString(),
    version: "1.0.0"
  };

  fs.writeFileSync(
    path.join(outputDir, 'index.json'),
    JSON.stringify(indexContent, null, 2)
  );

  // Write Quran chapters
  quranData.chapters.forEach(chapter => {
    fs.writeFileSync(
      path.join(outputDir, 'islamic/quran/chapters', `${chapter.id}.json`),
      JSON.stringify(chapter, null, 2)
    );
  });

  console.log('✅ Static content generated successfully');
}

generateStaticContent().catch(console.error);
