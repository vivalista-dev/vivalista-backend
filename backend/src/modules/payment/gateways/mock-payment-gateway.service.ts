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
    const method = input.paymentMethod.toUpperCase();

    if (method === 'PIX') {
      return {
        gatewayProvider: 'mock',
        gatewayPaymentId: `mock_pix_${input.paymentId}`,
        externalReference: input.paymentId,
        status: 'PENDING',
        checkoutUrl: null,
        pixCode: `00020126580014BR.GOV.BCB.PIX0136mock-${input.paymentId}520400005303986540${input.amount.toFixed(
          2,
        )}5802BR5909VIVALISTA6009SAOPAULO62070503***6304ABCD`,
        pixQrCode: `mock-qr-code-${input.paymentId}`,
        boletoUrl: null,
        boletoBarcode: null,
      };
    }

    if (method === 'BOLETO') {
      return {
        gatewayProvider: 'mock',
        gatewayPaymentId: `mock_boleto_${input.paymentId}`,
        externalReference: input.paymentId,
        status: 'PENDING',
        checkoutUrl: null,
        pixCode: null,
        pixQrCode: null,
        boletoUrl: `https://mock.vivalista.com/boleto/${input.paymentId}`,
        boletoBarcode: `34191.79001 01043.510047 91020.150008 5 123400000${Math.round(
          input.amount * 100,
        )}`,
      };
    }

    return {
      gatewayProvider: 'mock',
      gatewayPaymentId: `mock_card_${input.paymentId}`,
      externalReference: input.paymentId,
      status: 'PENDING',
      checkoutUrl: `https://mock.vivalista.com/checkout/${input.paymentId}`,
      pixCode: null,
      pixQrCode: null,
      boletoUrl: null,
      boletoBarcode: null,
    };
  }
}