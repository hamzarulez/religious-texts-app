export class StorageService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://hamzarulez.github.io/religious-texts-app';
  }

  async getContent(religion: string, book: string, chapter: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/${religion}/${book}/chapters/${chapter}.json`;
      console.log('Fetching content from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched content for chapter ${chapter}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch content for ${religion}/${book}/${chapter}:`, error);
      return null;
    }
  }

  async getMetadata(religion: string, book: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/${religion}/${book}/metadata.json`;
      console.log('Fetching metadata from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched metadata for ${religion}/${book}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch metadata for ${religion}/${book}:`, error);
      return null;
    }
  }

  async getHadithMetadata(collection: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/islamic/hadith/${collection}/metadata.json`;
      console.log('Fetching hadith metadata from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hadith metadata: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched metadata for ${collection}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch metadata for ${collection}:`, error);
      return null;
    }
  }

  async getHadithChapter(collection: string, chapterId: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/islamic/hadith/${collection}/chapters/${chapterId}.json`;
      console.log('Fetching hadith chapter from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hadith chapter: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched chapter ${chapterId} from ${collection}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch chapter ${chapterId} from ${collection}:`, error);
      return null;
    }
  }
}
