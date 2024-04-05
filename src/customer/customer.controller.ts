import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.customerService.findOne(id);
  }

  @Post(':id/point/transfer')
  transferPoint(
    @Param('id') receiverId: number,
    @Body() tranferrerId: number,
    @Body() point: number,
  ) {
    return this.customerService.transferPoint(tranferrerId, receiverId, point);
  }
}
