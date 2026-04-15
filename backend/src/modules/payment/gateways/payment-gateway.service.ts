export type GatewayProviderName = 'mercadopago' | string;

export type GatewayPaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | string;

export type GatewayCreatePaymentInput = Readonly<{
  paymentId: string;
  organizationId: string;
  eventId: string;
  giftId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentMethod: string;
  amount: number;
}>;

export type GatewayCreatePaymentOutput = Readonly<{
  gatewayProvider: GatewayProviderName;
  gatewayPaymentId: string;
  externalReference: string;
  status: GatewayPaymentStatus;
  checkoutUrl: string | null;
  pixCode: string | null;
  pixQrCode: string | null;
  boletoUrl: string | null;
  boletoBarcode: string | null;
}>;

/**
 * Contrato base da camada de integração com gateway.
 *
 * Regras esperadas:
 * - receber dados já validados pela camada de service
 * - criar a intenção/pagamento no gateway externo
 * - devolver um payload padronizado para persistência local
 * - nunca devolver campos fora do contrato principal desta interface
 *
 * Observações:
 * - `externalReference` deve permitir reconciliar o pagamento externo com o registro local
 * - `status` deve refletir o estado inicial devolvido pelo gateway
 * - URLs e códigos devem ser devolvidos como `null` quando não se aplicarem ao método escolhido
 */
export abstract class PaymentGatewayService {
  abstract createPayment(
    input: GatewayCreatePaymentInput,
  ): Promise<GatewayCreatePaymentOutput>;
}