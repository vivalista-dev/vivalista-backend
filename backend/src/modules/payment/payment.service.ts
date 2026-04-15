
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ContributionStatus,
  GiftStatus,
  GiftType,
  PaymentMethod as PrismaPaymentMethod,
  PriceMode,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentGatewayService } from './gateways/payment-gateway.service';
import { MercadoPagoConfig, Payment as MercadoPagoPayment } from 'mercadopago';

type ValidatedOrganization = {
  id: string;
  name: string;
  paymentGateway: string | null;
  paymentAccountId: string | null;
  paymentAccountStatus: string | null;
  paymentAccountReady: boolean | null;
};

type ValidatedEvent = {
  id: string;
  organizationId: string;
  name: string;
  slug: string | null;
  status: string;
};

type ValidatedGift = {
  id: string;
  eventId: string;
  organizationId: string;
  title: string;
  isActive: boolean;
  isReserved: boolean;
  isPurchased: boolean;
  reservedByName: string | null;
  purchasedByName: string | null;
  giftType: GiftType;
  giftStatus: GiftStatus;
  price: number | null;
  priceMode: PriceMode;
  allowCustomAmount: boolean;
  quotaTotal: number | null;
  quotaSold: number | null;
  minAmount: number | null;
  maxAmount: number | null;
};

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  private getMercadoPagoPaymentClient() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new InternalServerErrorException(
        'MERCADOPAGO_ACCESS_TOKEN não configurado no ambiente.',
      );
    }

    const client = new MercadoPagoConfig({
      accessToken,
    });

    return new MercadoPagoPayment(client);
  }

  private normalizeOptionalString(value: unknown): string | null {
    if (value === undefined || value === null) return null;
    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : null;
  }

  private normalizeRequiredString(value: unknown, fieldLabel: string): string {
    const normalized = this.normalizeOptionalString(value);

    if (!normalized) {
      throw new BadRequestException(`${fieldLabel} é obrigatório.`);
    }

    return normalized;
  }

  private normalizeAmount(value: unknown): number {
    const amount = Number(value);

    if (Number.isNaN(amount) || amount <= 0) {
      throw new BadRequestException('amount deve ser maior que zero.');
    }

    return Number(amount.toFixed(2));
  }

  private normalizeQuotaQuantity(value: unknown): number {
    if (value === undefined || value === null || value === '') return 1;

    const quantity = Number(value);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException(
        'quotaQuantity deve ser um inteiro maior que zero.',
      );
    }

    return quantity;
  }

  private normalizePaymentMethod(value: unknown): string {
    return this.normalizeRequiredString(value, 'paymentMethod').toUpperCase();
  }

  private async findOrganizationOrFail(
    organizationId: string,
  ): Promise<ValidatedOrganization> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        paymentGateway: true,
        paymentAccountId: true,
        paymentAccountStatus: true,
        paymentAccountReady: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada.');
    }

    return organization;
  }

  private validateOrganizationPaymentReadiness(
    organization: ValidatedOrganization,
  ) {
    if (!organization.paymentAccountReady) {
      throw new BadRequestException(
        'A organização ainda não está pronta para receber pagamentos.',
      );
    }

    if (!organization.paymentGateway) {
      throw new BadRequestException(
        'A organização não possui gateway de pagamento configurado.',
      );
    }
  }

  private validateEventPublicationForPublicPayments(event: ValidatedEvent) {
    if (event.status === 'CANCELLED') {
      throw new BadRequestException(
        'Este evento está cancelado e não pode receber pagamentos.',
      );
    }
  }

  private async validateEventAndOrganization(eventId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId },
      select: {
        id: true,
        organizationId: true,
        name: true,
        slug: true,
        status: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const organization = await this.findOrganizationOrFail(event.organizationId);

    this.validateOrganizationPaymentReadiness(organization);
    this.validateEventPublicationForPublicPayments(event);

    return { event, organization };
  }

  private async validatePrivateEventAndOrganization(
    organizationId: string,
    eventId: string,
  ) {
    const organization = await this.findOrganizationOrFail(organizationId);
    this.validateOrganizationPaymentReadiness(organization);

    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId,
      },
      select: {
        id: true,
        organizationId: true,
        name: true,
        slug: true,
        status: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    return { event, organization };
  }

  private async validateGiftIfProvided(
    organizationId: string,
    eventId: string,
    giftId?: string,
  ): Promise<ValidatedGift | null> {
    if (!giftId) return null;

    const gift = await this.prisma.gift.findFirst({
      where: {
        id: giftId,
        eventId,
        organizationId,
      },
      select: {
        id: true,
        eventId: true,
        organizationId: true,
        title: true,
        isActive: true,
        isReserved: true,
        isPurchased: true,
        reservedByName: true,
        purchasedByName: true,
        giftType: true,
        giftStatus: true,
        price: true,
        priceMode: true,
        allowCustomAmount: true,
        quotaTotal: true,
        quotaSold: true,
        minAmount: true,
        maxAmount: true,
      },
    });

    if (!gift) {
      throw new NotFoundException('Presente não encontrado.');
    }

    if (!gift.isActive) {
      throw new BadRequestException('Este presente não está ativo.');
    }

    if (gift.giftStatus === GiftStatus.DISABLED) {
      throw new BadRequestException('Este presente está desativado.');
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Este presente já foi comprado.');
    }

    if (gift.giftType === GiftType.PHYSICAL && gift.isReserved) {
      throw new BadRequestException('Este presente já está reservado.');
    }

    return gift;
  }

  private getQuotaRemaining(gift: Pick<ValidatedGift, 'quotaTotal' | 'quotaSold'>) {
    return Math.max((gift.quotaTotal ?? 0) - (gift.quotaSold ?? 0), 0);
  }

  private validateFixedPriceAmount(
    gift: Pick<ValidatedGift, 'price'>,
    amount: number,
    message: string,
  ) {
    if (!gift.price || gift.price <= 0) {
      throw new BadRequestException(
        'O presente não possui valor configurado corretamente.',
      );
    }

    const expectedAmount = Number(Number(gift.price).toFixed(2));

    if (amount !== expectedAmount) {
      throw new BadRequestException(message);
    }
  }

  private validateVariableAmountAgainstGiftRules(
    gift: Pick<
      ValidatedGift,
      'priceMode' | 'price' | 'minAmount' | 'maxAmount' | 'allowCustomAmount'
    >,
    amount: number,
  ) {
    if (gift.priceMode === PriceMode.FIXED && gift.price && gift.price > 0) {
      const expectedAmount = Number(Number(gift.price).toFixed(2));

      if (amount !== expectedAmount) {
        throw new BadRequestException(
          'Para presente com valor fixo, o amount deve ser igual ao valor configurado.',
        );
      }
    }

    if (
      gift.priceMode === PriceMode.FLEXIBLE &&
      gift.allowCustomAmount === false &&
      gift.price &&
      gift.price > 0
    ) {
      const expectedAmount = Number(Number(gift.price).toFixed(2));

      if (amount !== expectedAmount) {
        throw new BadRequestException(
          'Este presente não permite valor diferente do configurado.',
        );
      }
    }

    if (gift.minAmount !== null && gift.minAmount !== undefined) {
      if (amount < gift.minAmount) {
        throw new BadRequestException(
          'O valor informado é menor que o mínimo permitido.',
        );
      }
    }

    if (gift.maxAmount !== null && gift.maxAmount !== undefined) {
      if (amount > gift.maxAmount) {
        throw new BadRequestException(
          'O valor informado é maior que o máximo permitido.',
        );
      }
    }
  }

  private validatePaymentAgainstGift(
    gift: ValidatedGift | null,
    amount: number,
    quotaQuantity: number,
  ) {
    if (!gift) return;

    if (gift.giftType === GiftType.PHYSICAL) {
      this.validateFixedPriceAmount(
        gift,
        amount,
        'Para presente físico, o valor do pagamento deve ser igual ao valor do presente.',
      );

      return;
    }

    if (gift.giftType === GiftType.QUOTA) {
      if (!gift.price || gift.price <= 0) {
        throw new BadRequestException(
          'Presente por cotas sem valor de cota configurado.',
        );
      }

      if (!gift.quotaTotal || gift.quotaTotal <= 0) {
        throw new BadRequestException(
          'Presente por cotas sem quantidade total configurada.',
        );
      }

      const quotaRemaining = this.getQuotaRemaining(gift);

      if (quotaRemaining <= 0) {
        throw new BadRequestException(
          'Este presente por cotas não possui cotas disponíveis.',
        );
      }

      if (quotaQuantity > quotaRemaining) {
        throw new BadRequestException(
          'Quantidade de cotas maior que o disponível.',
        );
      }

      const expectedAmount = Number((gift.price * quotaQuantity).toFixed(2));

      if (amount !== expectedAmount) {
        throw new BadRequestException(
          'Para pagamento por cotas, o valor deve corresponder ao total das cotas selecionadas.',
        );
      }

      return;
    }

    if (
      gift.giftType === GiftType.CASH ||
      gift.giftType === GiftType.FREE_CONTRIBUTION
    ) {
      this.validateVariableAmountAgainstGiftRules(gift, amount);
    }
  }

  private async createBasePaymentAndContribution(input: {
    organizationId: string;
    eventId: string;
    giftId?: string | null;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    paymentMethod: string;
    amount: number;
    message?: string | null;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          organizationId: input.organizationId,
          eventId: input.eventId,
          giftId: input.giftId ?? null,
          buyerName: input.buyerName,
          buyerEmail: input.buyerEmail,
          buyerPhone: input.buyerPhone,
          paymentMethod: input.paymentMethod,
          amount: input.amount,
          status: 'PENDING',
        },
      });

      const contribution = await tx.contribution.create({
        data: {
          organizationId: input.organizationId,
          eventId: input.eventId,
          giftId: input.giftId ?? null,
          contributorName: input.buyerName,
          contributorEmail: input.buyerEmail,
          contributorPhone: input.buyerPhone,
          message: input.message ?? null,
          amount: input.amount,
          paymentMethod: input.paymentMethod as PrismaPaymentMethod,
          status: ContributionStatus.PENDING,
          isPublic: true,
        },
      });

      return { payment, contribution };
    });
  }

  private async findPendingContributionForPayment(payment: {
    id: string;
    organizationId: string;
    eventId: string;
    giftId: string | null;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    amount: number;
  }) {
    const contribution = await this.prisma.contribution.findFirst({
      where: {
        organizationId: payment.organizationId,
        eventId: payment.eventId,
        giftId: payment.giftId,
        contributorName: payment.buyerName,
        contributorEmail: payment.buyerEmail,
        contributorPhone: payment.buyerPhone,
        amount: payment.amount,
        status: ContributionStatus.PENDING,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!contribution) {
      throw new NotFoundException(
        'Contribuição vinculada ao pagamento não encontrada.',
      );
    }

    return contribution;
  }

  private calculateQuotaQuantityFromPayment(
    gift: Pick<ValidatedGift, 'giftType' | 'price'>,
    paymentAmount: number,
  ): number {
    if (gift.giftType !== GiftType.QUOTA) {
      return 1;
    }

    if (!gift.price || gift.price <= 0) {
      throw new BadRequestException(
        'Presente por cotas sem valor de cota configurado.',
      );
    }

    const rawQuantity = paymentAmount / gift.price;
    const roundedQuantity = Math.round(rawQuantity);

    if (
      !Number.isFinite(rawQuantity) ||
      roundedQuantity <= 0 ||
      Math.abs(rawQuantity - roundedQuantity) > 0.000001
    ) {
      throw new BadRequestException(
        'Não foi possível determinar a quantidade de cotas a partir do pagamento.',
      );
    }

    return roundedQuantity;
  }

  private getIntentSuccessMessage(gift: ValidatedGift | null) {
    if (!gift) {
      return 'Contribuição livre criada com sucesso.';
    }

    if (gift.giftType === GiftType.QUOTA) {
      return 'Pagamento de cotas criado com sucesso.';
    }

    if (gift.giftType === GiftType.PHYSICAL) {
      return 'Pagamento do presente criado com sucesso.';
    }

    return 'Pagamento criado com sucesso.';
  }

  private async createIntentCore(params: {
    organizationId: string;
    eventId: string;
    giftId?: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    paymentMethod: string;
    amount: number;
    message?: string;
    quotaQuantity?: number;
  }) {
    const gift = await this.validateGiftIfProvided(
      params.organizationId,
      params.eventId,
      params.giftId,
    );

    const buyerName = this.normalizeRequiredString(params.buyerName, 'buyerName');
    const buyerEmail = this.normalizeRequiredString(
      params.buyerEmail,
      'buyerEmail',
    );
    const buyerPhone = this.normalizeRequiredString(
      params.buyerPhone,
      'buyerPhone',
    );
    const paymentMethod = this.normalizePaymentMethod(params.paymentMethod);
    const message = this.normalizeOptionalString(params.message);

    const amount = this.normalizeAmount(params.amount);
    const quotaQuantity = this.normalizeQuotaQuantity(params.quotaQuantity);

    if (!gift && quotaQuantity !== 1) {
      throw new BadRequestException(
        'quotaQuantity só pode ser usado quando houver presente por cotas.',
      );
    }

    this.validatePaymentAgainstGift(gift, amount, quotaQuantity);

    const { payment, contribution } =
      await this.createBasePaymentAndContribution({
        organizationId: params.organizationId,
        eventId: params.eventId,
        giftId: params.giftId ?? null,
        buyerName,
        buyerEmail,
        buyerPhone,
        paymentMethod,
        amount,
        message,
      });

    const gatewayResponse = await this.paymentGatewayService.createPayment({
      paymentId: payment.id,
      organizationId: params.organizationId,
      eventId: params.eventId,
      giftId: params.giftId ?? '',
      buyerName,
      buyerEmail,
      buyerPhone,
      paymentMethod,
      amount,
    });

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        gatewayProvider: gatewayResponse.gatewayProvider,
        gatewayPaymentId: gatewayResponse.gatewayPaymentId,
        externalReference: gatewayResponse.externalReference,
        status: gatewayResponse.status,
        checkoutUrl: gatewayResponse.checkoutUrl,
        pixCode: gatewayResponse.pixCode,
        pixQrCode: gatewayResponse.pixQrCode,
        boletoUrl: gatewayResponse.boletoUrl,
        boletoBarcode: gatewayResponse.boletoBarcode,
      },
    });

    return {
      message: this.getIntentSuccessMessage(gift),
      payment: updatedPayment,
      contribution,
      paymentData: {
        paymentMethod: updatedPayment.paymentMethod,
        status: updatedPayment.status,
        checkoutUrl: updatedPayment.checkoutUrl,
        pixCode: updatedPayment.pixCode,
        pixQrCode: updatedPayment.pixQrCode,
        boletoUrl: updatedPayment.boletoUrl,
        boletoBarcode: updatedPayment.boletoBarcode,
      },
    };
  }

  async createPublicPaymentIntent(dto: CreatePaymentDto) {
    const { event } = await this.validateEventAndOrganization(dto.eventId);

    return this.createIntentCore({
      organizationId: event.organizationId,
      eventId: dto.eventId,
      giftId: dto.giftId,
      buyerName: dto.buyerName,
      buyerEmail: dto.buyerEmail,
      buyerPhone: dto.buyerPhone,
      paymentMethod: dto.paymentMethod,
      amount: dto.amount,
      message: dto.message,
      quotaQuantity: dto.quotaQuantity,
    });
  }

  async createPaymentIntent(organizationId: string, dto: CreatePaymentDto) {
    await this.validatePrivateEventAndOrganization(organizationId, dto.eventId);

    return this.createIntentCore({
      organizationId,
      eventId: dto.eventId,
      giftId: dto.giftId,
      buyerName: dto.buyerName,
      buyerEmail: dto.buyerEmail,
      buyerPhone: dto.buyerPhone,
      paymentMethod: dto.paymentMethod,
      amount: dto.amount,
      message: dto.message,
      quotaQuantity: dto.quotaQuantity,
    });
  }

  private async applyGiftConfirmationEffects(
    tx: PrismaService,
    organizationId: string,
    payment: {
      eventId: string;
      giftId: string | null;
      buyerName: string;
      amount: number;
    },
  ) {
    if (!payment.giftId) {
      return null;
    }

    const gift = await tx.gift.findFirst({
      where: {
        id: payment.giftId,
        eventId: payment.eventId,
        organizationId,
      },
      select: {
        id: true,
        title: true,
        giftType: true,
        giftStatus: true,
        price: true,
        quotaTotal: true,
        quotaSold: true,
      },
    });

    if (!gift) {
      throw new NotFoundException(
        'Presente vinculado ao pagamento não encontrado.',
      );
    }

    if (gift.giftType === GiftType.PHYSICAL) {
      return tx.gift.update({
        where: { id: gift.id },
        data: {
          isPurchased: true,
          giftStatus: GiftStatus.PURCHASED,
          purchasedByName: payment.buyerName,
          purchasedAt: new Date(),
          isReserved: false,
          reservedByName: null,
          reservedAt: null,
        },
      });
    }

    if (gift.giftType === GiftType.QUOTA) {
      const quantity = this.calculateQuotaQuantityFromPayment(
        {
          giftType: gift.giftType,
          price: gift.price,
        },
        payment.amount,
      );

      const newQuotaSold = (gift.quotaSold ?? 0) + quantity;
      const quotaTotal = gift.quotaTotal ?? 0;
      const fullyFunded = quotaTotal > 0 && newQuotaSold >= quotaTotal;

      return tx.gift.update({
        where: { id: gift.id },
        data: {
          quotaSold: newQuotaSold,
          giftStatus: fullyFunded
            ? GiftStatus.PURCHASED
            : GiftStatus.PARTIALLY_FUNDED,
        },
      });
    }

    return tx.gift.update({
      where: { id: gift.id },
      data: {
        giftStatus: GiftStatus.PARTIALLY_FUNDED,
      },
    });
  }

  async confirmPayment(organizationId: string, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
        organizationId,
      },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado.');
    }

    if (payment.status === 'PAID') {
      throw new BadRequestException('Este pagamento já foi confirmado.');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      });

      const contribution = await this.findPendingContributionForPayment(payment);

      const updatedContribution = await tx.contribution.update({
        where: { id: contribution.id },
        data: {
          status: ContributionStatus.PAID,
          paidAt: new Date(),
        },
      });

      const updatedGift = await this.applyGiftConfirmationEffects(
        tx as unknown as PrismaService,
        organizationId,
        {
          eventId: payment.eventId,
          giftId: payment.giftId,
          buyerName: payment.buyerName,
          amount: payment.amount,
        },
      );

      return {
        payment: updatedPayment,
        gift: updatedGift,
        contribution: updatedContribution,
      };
    });

    return {
      message: 'Pagamento confirmado com sucesso.',
      payment: result.payment,
      gift: result.gift,
      contribution: result.contribution,
    };
  }

  async processPublicMockWebhookPaid(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado.');
    }

    return this.processMockWebhookPaid(payment.organizationId, paymentId);
  }

  async processMockWebhookPaid(organizationId: string, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
        organizationId,
      },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado.');
    }

    if (payment.status === 'PAID') {
      return {
        message: 'Webhook recebido, mas pagamento já estava confirmado.',
        payment,
      };
    }

    const result = await this.confirmPayment(organizationId, paymentId);

    return {
      webhookEvent: 'payment.approved',
      payment: result.payment,
      gift: result.gift,
      contribution: result.contribution,
      message: 'Webhook mock processado com sucesso.',
    };
  }

  async processMercadoPagoWebhook(body: any, query: any) {
    const notificationType =
      body?.type || body?.topic || query?.type || query?.topic || null;

    const mercadoPagoPaymentId =
      body?.data?.id || query?.['data.id'] || query?.id || null;

    if (!mercadoPagoPaymentId) {
      return {
        received: true,
        ignored: true,
        message: 'Webhook recebido sem payment id.',
      };
    }

    if (
      notificationType &&
      notificationType !== 'payment' &&
      notificationType !== 'merchant_order'
    ) {
      return {
        received: true,
        ignored: true,
        message: `Webhook ignorado para tipo ${notificationType}.`,
      };
    }

    const mpPaymentClient = this.getMercadoPagoPaymentClient();
    const mercadoPagoPayment = await mpPaymentClient.get({
      id: String(mercadoPagoPaymentId),
    });

    const externalReference = mercadoPagoPayment.external_reference || null;

    if (!externalReference) {
      return {
        received: true,
        ignored: true,
        message: 'Pagamento Mercado Pago sem external_reference.',
      };
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: externalReference },
    });

    if (!payment) {
      return {
        received: true,
        ignored: true,
        message: 'Pagamento local não encontrado pelo external_reference.',
      };
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        gatewayPaymentId: String(mercadoPagoPayment.id),
        status: String(mercadoPagoPayment.status || payment.status),
      },
    });

    if (payment.status === 'PAID') {
      return {
        received: true,
        approved: true,
        alreadyProcessed: true,
        message: 'Pagamento já estava confirmado no VivaLista.',
      };
    }

    if (mercadoPagoPayment.status !== 'approved') {
      return {
        received: true,
        approved: false,
        mercadoPagoStatus: mercadoPagoPayment.status,
        message: 'Pagamento ainda não foi aprovado.',
      };
    }

    const result = await this.confirmPayment(payment.organizationId, payment.id);

    return {
      received: true,
      approved: true,
      webhookEvent: 'payment.approved',
      payment: result.payment,
      gift: result.gift,
      contribution: result.contribution,
      message: 'Webhook Mercado Pago processado com sucesso.',
    };
  }

  getModuleStatus() {
    return {
      module: 'payment',
      status: 'ok',
      gateway: 'mercadopago',
      message: 'Módulo de pagamentos carregado.',
    };
  }
}
