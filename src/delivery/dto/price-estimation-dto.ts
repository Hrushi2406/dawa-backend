import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsNotEmptyObject,
  IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class Point {
  @IsString()
  address: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsPhoneNumber()
  phoneNo: string;

  @IsString()
  name: string;

  @IsString()
  flatNo: string;

  @IsString()
  buildingNo: string;

  @IsString()
  landmark: string;
}

export class PriceEstimationDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Point)
  pickup: Point;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Point)
  dropoff: Point;

  @IsString()
  type: 'borzo';

  @IsOptional()
  @IsNumber()
  weight?: number;
}
