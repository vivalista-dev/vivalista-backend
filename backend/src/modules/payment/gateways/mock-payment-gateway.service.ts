import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import {
  GatewayCreatePaymentInput,
  GatewayCreatePaymentOutput,
  PaymentGatewayService,
} from './payment-gateway.service';

@Injectable()
export class MockPaymentGatewayService implements PaymentGatewayService {
  private readonly client: MercadoPagoConfig;
  private readonly preference: Preference;

  constructor() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new InternalServerErrorException(
        'MERCADOPAGO_ACCESS_TOKEN não configurado no ambiente.',
      );
    }

    this.client = new MercadoPagoConfig({
      accessToken,
    });

    this.preference = new Preference(this.client);
  }

  async createPayment(
    input: GatewayCreatePaymentInput,
  ): Promise<GatewayCreatePaymentOutput> {
    const requestBody = {
      external_reference: input.paymentId,
      items: [
        {
          id: input.giftId,
          title: 'Presente VivaLista',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(input.amount),
        },
      ],
      payer: {
        name: input.buyerName,
        email: input.buyerEmail,
      },
    };

    try {
      console.log('============= MP DEBUG START =============');
      console.log('INPUT CREATE PAYMENT:', input);
      console.log('REQUEST BODY MP:', JSON.stringify(requestBody, null, 2));

      const response = await this.preference.create({
        body: requestBody,
      });

      console.log('RESPONSE MP:', response);
      console.log('============= MP DEBUG END ===============');

      return {
        gatewayProvider: 'mercadopago',
        gatewayPaymentId: String(response.id),
        externalReference: input.paymentId,
        status: 'PENDING',
        checkoutUrl: response.init_point ?? null,
        pixCode: null,
        pixQrCode: null,
        boletoUrl: null,
        boletoBarcode: null,
      };
    } catch (error: any) {
      console.log('============= MP DEBUG ERROR =============');
      console.log('MP ERROR RAW:', error);
      console.log('MP ERROR MESSAGE:', error?.message);
      console.log('MP ERROR CAUSE:', error?.cause);
      console.log('MP ERROR RESPONSE:', error?.response);
      console.log('MP ERROR STATUS:', error?.status);
      console.log('============= MP DEBUG ERROR END =========');

      throw new InternalServerErrorException(
        'Erro ao criar pagamento no Mercado Pago.',
      );
    }
  }
}