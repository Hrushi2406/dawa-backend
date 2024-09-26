import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';

class DeliveryDetails {
  @IsString()
  order_id: string;

  @IsString()
  delivery_type: string;

  @IsString()
  delivery_id: string;

  @IsString()
  client_id: string;

  @IsString()
  tracking_url: string;

  @IsString()
  status: string;

  @IsString()
  status_datetime: string;

  @IsString()
  status_description: string;

  @IsString()
  created_datetime: string;

  @IsString()
  order_payment_amount: string;
}
export class BorzoDeliveryUpdateDto {
  @IsString()
  'X-DV-Signature': string;

  @IsString()
  event_datetime: string;

  @IsString()
  event_type: string;

  @IsNotEmptyObject()
  delivery: DeliveryDetails;
}
