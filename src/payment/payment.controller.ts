// payment.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { CustomerService } from '../customer/customer.service';
import { PurchasePointDTO } from '../payment/purchase-point.dto';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
    private readonly customerService: CustomerService,
  ) {}

  @Post('point')
  async purchasePoint(@Body() purchasePoint: PurchasePointDTO): Promise<any> {
    const result = await this.paymentService.makePayment(purchasePoint);

    try {
      //lets assume we made a successful transaction
      // result.status == 200
      if (true) {
        const amountCutoff = this.configService.get<number>('AMOUNT_TO_SPEND');

        //calculate rewardable point upon spend amount
        //lets assume spendAmount should only be multiply of 1 point cost
        //should use ceil() or round()
        const rewardPoints = purchasePoint.spendAmount / amountCutoff;

        //reward point to customer's wallet
        await this.customerService.rewardPoint(
          purchasePoint.customerId,
          rewardPoints,
        );
      }

      return { success: true, data: result };
    } catch {
      throw new Error('error buying points');
    }
  }
}
