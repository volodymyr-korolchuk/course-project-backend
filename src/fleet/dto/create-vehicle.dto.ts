import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  productionYear: number;

  @IsNotEmpty()
  @IsString()
  color: string;

  classId: number;

  mileage: number;

  @IsNotEmpty()
  @IsString()
  vrm: string;

  @IsNotEmpty()
  parkingLocationId: number;
}
