import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PriceEstimationDto } from './dto/price-estimation-dto';
import { Logger } from '@nestjs/common';
import { BorzoDeliveryUpdateDto } from './dto/borzo-delivery-update-dto';
import { firestore } from 'firebase-admin';
import { generateId } from 'src/helpers';

@Injectable()
export class BorzoService {
  private baseUrl = process.env.BORZO_BASE_URL;

  private logger = new Logger();
  private transformer = new BorzoTransformer();
  private instance = axios.create({
    baseURL: this.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'X-DV-Auth-Token': process.env.BORZO_API_KEY,
    },
  });

  async fetchPriceEstimation(priceEstimationDto: PriceEstimationDto) {
    const points = this.transformer.to(priceEstimationDto);

    try {
      const response = await this.instance.post('/calculate-order', {
        type: 'standard',
        matter: 'Medicines',
        points,
        payment_method: 'balance',
      });

      return this.transformer.from(response.data);
    } catch (error) {
      this.logger.error(error.response.data);
      throw new HttpException(
        `Failed to fetch price estimation`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createOrder(createOrderDto: PriceEstimationDto) {
    const points = this.transformer.to(createOrderDto);

    try {
      const response = await this.instance.post('/create-order', {
        type: 'standard',
        matter: 'Medicines',
        points,
        payment_method: 'balance',
      });

      return this.transformer.from(response.data);
    } catch (error) {
      this.logger.error(error.response.data);
      throw new HttpException(
        `Order creation failed due to internal server error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelOrder(partnerOrderId: string) {
    try {
      const response = await this.instance.post('/cancel-order', {
        order_id: partnerOrderId,
      });
      return response.data;
    } catch (error) {
      this.logger.error(error.response.data);
      throw new HttpException(
        `Failed to cancel order`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

class BorzoTransformer {
  to(priceEstimationDto: PriceEstimationDto) {
    const pickup = priceEstimationDto.pickup;
    const dropoff = priceEstimationDto.dropoff;
    const points = [
      {
        address: pickup.address,
        latitude: pickup.lat,
        longitude: pickup.lng,
        building_number: pickup.buildingNo,
        apartment_number: pickup.flatNo,
        contact_person: {
          phone: pickup.phoneNo,
          name: pickup.name,
        },
      },
      {
        address: dropoff.address,
        latitude: dropoff.lat,
        longitude: dropoff.lng,
        building_number: dropoff.buildingNo,
        apartment_number: dropoff.flatNo,
        contact_person: {
          phone: dropoff.phoneNo,
          name: dropoff.name,
        },
      },
    ];

    return points;
  }

  from(data: any) {
    const pickup = data.order.points[0];
    const dropoff = data.order.points[1];

    return {
      ...data,
      type: 'borzo',
      partnerOrderId: data.order.order_id,
      payableAmount: data.order.payment_amount,
      deliveryFee: data.order.delivery_fee_amount,
      deliveryStatus: data.order.status,
      statusDescription: data.order.status_description,
      pickup: {
        address: pickup.address,
        lat: pickup.latitude,
        lng: pickup.longitude,
        buildingNo: pickup.building_number,
        flatNo: pickup.apartment_number,
      },
      dropoff: {
        address: dropoff.address,
        lat: dropoff.latitude,
        lng: dropoff.longitude,
        buildingNo: dropoff.building_number,
        flatNo: dropoff.apartment_number,
      },
    };
  }
}
