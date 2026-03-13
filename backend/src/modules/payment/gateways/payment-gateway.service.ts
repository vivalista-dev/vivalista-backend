export type GatewayCreatePaymentInput = {
  paymentId: string;
  organizationId: string;
  eventId: string;
  giftId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentMethod: string;
  amount: number;
};

export type GatewayCreatePaymentOutput = {
  gatewayProvider: string;
  gatewayPaymentId: string;
  externalReference: string;
  status: string;
  checkoutUrl: string | null;
  pixCode: string | null;
  pixQrCode: string | null;
  boletoUrl: string | null;
  boletoBarcode: string | null;
};

export abstract class PaymentGatewayService {
  abstract createPayment(
    input: GatewayCreatePaymentInput,
  ): Promise<GatewayCreatePaymentOutput>;
}