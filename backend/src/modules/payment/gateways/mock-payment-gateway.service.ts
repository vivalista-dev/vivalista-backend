import { Injectable } from '@nestjs/common';
import {
  GatewayCreatePaymentInput,
  GatewayCreatePaymentOutput,
  PaymentGatewayService,
} from './payment-gateway.service';

@Injectable()
export class MockPaymentGatewayService implements PaymentGatewayService {
  async createPayment(
    input: GatewayCreatePaymentInput,
  ): Promise<GatewayCreatePaymentOutput> {
    const backendUrl = (process.env.BACKEND_URL || 'http://localhost:3001').replace(/\/$/, '');

    return {
      gatewayProvider: 'mock',
      gatewayPaymentId: `mock-${input.paymentId}`,
      externalReference: input.paymentId,
      status: 'PENDING',
      checkoutUrl: `${backendUrl}/payments/public/mock/${input.paymentId}/paid`,
      pixCode: null,
      pixQrCode: null,
      boletoUrl: null,
      boletoBarcode: null,
    };
  }
}
