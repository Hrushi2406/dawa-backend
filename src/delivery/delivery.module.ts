import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { BorzoService } from './borzo.service';
import { DeliveryDbService } from './delivery-db.service';
import { FirebaseModule } from '../firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [DeliveryController],
  providers: [BorzoService, DeliveryDbService],
})
export class DeliveryModule {}
