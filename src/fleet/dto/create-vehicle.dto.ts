import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  make: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  model: string;

  @IsNotEmpty()
  @IsNumber()
  productionYear: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  color: string;

  @IsNotEmpty()
  @IsNumber()
  classId: number;

  @IsNotEmpty()
  @IsNumber()
  mileage: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  vrm: string;

  @IsNotEmpty()
  @IsNumber()
  parkingLocationId: number;
}
