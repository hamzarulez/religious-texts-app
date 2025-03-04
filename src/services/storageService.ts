export class StorageService {
  private baseUrl: string;

  constructor() {
    // Replace with your GitHub Pages URL
    this.baseUrl = 'https://[username].github.io/religious-texts-app';
  }

  async getContent(religion: string, book: string, chapter: string): Promise<any> {
    const url = `${this.baseUrl}/${religion}/${book}/chapters/${chapter}.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getMetadata(religion: string, book: string): Promise<any> {
    const url = `${this.baseUrl}/${religion}/${book}/metadata.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    
    return response.json();
  }
}
