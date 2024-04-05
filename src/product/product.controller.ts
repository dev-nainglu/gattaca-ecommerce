import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDTO) {
    return this.productService.create(createProductDto);
  }

  @Get(':id/get')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Post(':id/update')
  update(@Param('id') id: string, @Body() updateProductDto: CreateProductDTO) {
    return this.productService.update(+id, updateProductDto);
  }

  @Get(':id/remove')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
