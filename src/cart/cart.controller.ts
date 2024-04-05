import { Controller, Post, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddToCartDTO } from '../cart/dto/addtocart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  //should create cart along with new customer create
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  //add to cart
  @Post(':id/add')
  addToCart(@Body() addToCart: AddToCartDTO) {
    return this.cartService.addToCart(addToCart);
  }

  //checkout cart
  @Post(':id/checkout')
  checkoutCart(@Param('id') id: number) {
    return this.cartService.checkOutCart(id);
  }
}
