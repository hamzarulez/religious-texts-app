import { PutObjectCommand } from '@aws-sdk/client-s3';
import { MongoClient } from 'mongodb';
import { r2 } from '../src/config/storage';

async function uploadReligiousTexts() {
  const mongo = new MongoClient(process.env.MONGODB_URI!);
  
  try {
    await mongo.connect();
    const db = mongo.db('religious_texts');

    // Upload chapter content to R2
    const chapterKey = `quran/chapters/${chapterNumber}.json`;
    await r2.send(new PutObjectCommand({
      Bucket: 'religious-texts',
      Key: chapterKey,
      Body: JSON.stringify(chapterContent),
      ContentType: 'application/json',
    }));

    // Store metadata in MongoDB
    await db.collection('texts').insertOne({
      type: 'quran',
      chapterNumber,
      title: chapterData.title,
      versesCount: chapterData.verses.length,
      contentUrl: `https://religious-texts.${process.env.R2_DOMAIN}/${chapterKey}`,
      updatedAt: new Date()
    });
  } finally {
    await mongo.close();
  }
}