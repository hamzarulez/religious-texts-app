export interface TextMetadata {
  _id?: string;
  religion: 'islam' | 'christianity' | 'judaism';
  bookId: string;          // e.g., 'quran', 'bible', 'torah'
  type: string;            // e.g., 'scripture', 'commentary'
  chapterNumber?: number;
  title: string;
  description?: string;
  versesCount?: number;
  contentUrl: string;      // R2 URL
  language: string;
  updatedAt: Date;
}

export interface UserProgress {
  userId: string;
  textId: string;
  chapterNumber: number;
  lastReadVerse: number;
  bookmarks: number[];
  lastReadAt: Date;
}