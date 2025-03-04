import * as admin from 'firebase-admin';
import * as path from 'path';

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://triadoffaith.firebaseio.com"
  });
}

export const adminDb = admin.firestore();
