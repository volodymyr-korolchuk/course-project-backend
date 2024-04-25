import { IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  make: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  model: string;

  productionYear: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  color: string;

  classId: number;

  mileage: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  vrm: string;

  @IsNotEmpty()
  parkingLocationId: number;
}
