import { IsInt } from 'class-validator';

export class AddToCartDTO {
  @IsInt()
  cartId: number;

  @IsInt()
  productId: number;
}
