import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  invoiceId: number;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;
}
