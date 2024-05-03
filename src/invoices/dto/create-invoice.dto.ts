import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  leasingId: number;
  @IsNotEmpty()
  @IsNumber()
  amountDue: number;
  @IsNotEmpty()
  @IsNumber()
  insuranceAmount: number;
}
