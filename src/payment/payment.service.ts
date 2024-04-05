import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PurchasePointDTO } from '../payment/purchase-point.dto';

@Injectable()
export class PaymentService {
  paymentURL = 'https://paymentgateway.com/';

  //I understand that request parameters are different for each payment system
  //let me just assume that I sent required parameters to gateway while writing for this test.
  async makePayment(purchasePointDTO: PurchasePointDTO): Promise<any> {
    const response = await axios.post(
      this.paymentURL + '/make',
      purchasePointDTO,
    );
    return response.data;
  }
}
