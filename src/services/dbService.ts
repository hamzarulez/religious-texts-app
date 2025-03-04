import { MongoClient, Collection } from 'mongodb';
import { TextMetadata, UserProgress } from '../models/schemas';
import { env } from '../config/env';

export class DatabaseService {
  private client: MongoClient;
  private texts: Collection<TextMetadata>;
  private userProgress: Collection<UserProgress>;

  constructor() {
    this.client = new MongoClient(env.MONGODB_URI);
    this.texts = this.client.db(env.MONGODB_DB_NAME).collection('texts');
    this.userProgress = this.client.db(env.MONGODB_DB_NAME).collection('user_progress');
  }

  async connect() {
    await this.client.connect();
    await this.setupIndexes();
  }

  private async setupIndexes() {
    await this.texts.createIndex({ religion: 1, bookId: 1, chapterNumber: 1 });
    await this.texts.createIndex({ title: 'text', description: 'text' });
    await this.userProgress.createIndex({ userId: 1, textId: 1 });
  }

  async saveTextMetadata(metadata: TextMetadata) {
    return this.texts.insertOne(metadata);
  }

  async getTextMetadata(religion: string, bookId: string, chapterNumber?: number) {
    return this.texts.findOne({ religion, bookId, chapterNumber });
  }
}