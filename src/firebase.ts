import { initializeApp, ServiceAccount } from 'firebase-admin/app';
import { credential, firestore } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export function initializeFirebase(configService: ConfigService) {
  const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
  const adminConfig: ServiceAccount = {
    projectId,
    privateKey: configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };
  initializeApp({
    credential: credential.cert(adminConfig),
    databaseURL: `https://${projectId}.firebaseio.com`,
  });
}
