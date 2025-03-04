export const env = {
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
  R2_BUCKET_NAME: 'religious-texts',
  MONGODB_URI: process.env.MONGODB_URI!,
  MONGODB_DB_NAME: 'religious_texts'
} as const;