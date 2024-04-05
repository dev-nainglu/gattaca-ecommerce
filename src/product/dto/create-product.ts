import { IsString, IsInt } from 'class-validator';

// Define the DTO class
export class CreateProductDTO {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly pointCost: number;

  @IsInt()
  readonly inventoryCount: number;
}
