import { IsNotEmpty, IsString } from 'class-validator';

export class CancelOrderDto {
  @IsString()
  @IsNotEmpty()
  partnerOrderId: string;

  @IsString()
  @IsNotEmpty()
  type: 'borzo';
}
