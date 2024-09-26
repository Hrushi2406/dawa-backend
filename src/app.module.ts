import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeliveryModule } from './delivery/delivery.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseModule } from './firebase.module';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
};

@Module({
  imports: [DeliveryModule, ConfigModule.forRoot({}), FirebaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
