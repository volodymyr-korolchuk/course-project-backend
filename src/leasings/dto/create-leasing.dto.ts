import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLeasingDto {
  @IsNotEmpty()
  vehicleId: number;

  @IsNotEmpty()
  createdByEmployeeId: number;

  @IsNotEmpty()
  customerId: number;

  @IsNotEmpty()
  @IsString()
  pickupDate: string;

  @IsNotEmpty()
  @IsString()
  returnDate: string;

  @IsNotEmpty()
  allowedMileage: number;
}
