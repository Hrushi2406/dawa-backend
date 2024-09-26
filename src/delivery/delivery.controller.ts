import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { BorzoService } from './borzo.service';
import { PriceEstimationDto } from './dto/price-estimation-dto';
import { CancelOrderDto } from './dto/cancel-order-dto';
import { BorzoDeliveryUpdateDto } from './dto/borzo-delivery-update-dto';
import { DeliveryDbService } from './delivery-db.service';

@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly borzoService: BorzoService,
    private readonly dbService: DeliveryDbService,
  ) {}

  @Post('/estimate-price')
  estimatePrice(@Body() priceEstimationDto: PriceEstimationDto) {
    if (priceEstimationDto.type === 'borzo') {
      return this.borzoService.fetchPriceEstimation(priceEstimationDto);
    }
    throw new BadRequestException('Invalid delivery type');
  }

  @Post('/create-order')
  async createOrder(@Body() createOrderDto: PriceEstimationDto) {
    if (createOrderDto.type === 'borzo') {
      const data = await this.borzoService.createOrder(createOrderDto);
      return this.dbService.createDelivery(data);
    }
    throw new BadRequestException('Invalid delivery type');
  }

  @Post('/cancel-order')
  cancelOrder(@Body() cancelOrderDto: CancelOrderDto) {
    if (cancelOrderDto.type === 'borzo') {
      return this.borzoService.cancelOrder(cancelOrderDto.partnerOrderId);
    }
    throw new BadRequestException('Invalid delivery type');
  }

  @Post('/borzo/delivery-updates')
  async deliveryUpdates(@Body() updates: BorzoDeliveryUpdateDto) {
    if (updates.event_type === 'delivery_changed') {
      return this.dbService.registerUpdates(updates.delivery.order_id, {
        deliveryStatus: updates.delivery.status,
        statusDescription: updates.delivery.status_description ?? '',
        trackingUrl: updates.delivery.tracking_url ?? '',
      });
    }
  }
}
