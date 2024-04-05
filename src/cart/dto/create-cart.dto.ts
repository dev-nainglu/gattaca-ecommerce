import { IsInt } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  readonly customerId: number;
}
