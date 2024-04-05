import { IsString, IsInt } from 'class-validator';

export class PurchasePointDTO {
  @IsInt()
  readonly customerId: number;

  @IsInt()
  readonly spendAmount: number;

  @IsString()
  readonly paymentMethod: string;
}
