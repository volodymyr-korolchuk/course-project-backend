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

  @IsNotEmpty()
  productionYear: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  color: string;

  @IsNotEmpty()
  classId: number;

  @IsNotEmpty()
  mileage: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  vrm: string;

  @IsNotEmpty()
  parkingLocationId: number;
}
