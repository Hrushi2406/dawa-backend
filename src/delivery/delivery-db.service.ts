import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { app, firestore } from 'firebase-admin';
import { FirebaseRepository } from 'src/firebase.repository';
import { generateId } from 'src/helpers';

@Injectable()
export class DeliveryDbService {
  db: FirebaseFirestore.Firestore;

  constructor(private firebaseRepository: FirebaseRepository) {
    this.db = firebaseRepository.db;
  }

  async createDelivery(data: any) {
    const id = generateId();
    const updates = {
      ...data,
      id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.db.doc(`delivery_updates/${id}`).set(updates);
    return updates;
  }

  async registerUpdates(partnerOrderId: string, data: any) {
    const snapshot = await this.db
      .collection('delivery_updates')
      .where('partnerOrderId', '==', partnerOrderId)
      .get();

    if (snapshot.empty) {
      throw new HttpException(
        'No delivery was found from give order id',
        HttpStatus.NOT_FOUND,
      );
    } else {
      const doc = snapshot.docs[0];
      await this.db.doc(`delivery_updates/${doc.id}`).update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
    }
  }
}
