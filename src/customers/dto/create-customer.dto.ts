import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string;
}
