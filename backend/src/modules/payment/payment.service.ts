import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentGatewayService } from './gateways/payment-gateway.service';
import { MercadoPagoConfig, Payment as MercadoPagoPayment } from 'mercadopago';

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

  async createPublicPaymentIntent(dto: CreatePaymentDto) {
    console.log('================ PAYMENT DEBUG START ================');
    console.log('DTO RECEBIDO:', dto);

    const event = await this.prisma.event.findFirst({
      where: {
        id: dto.eventId,
      },
    });

    console.log('EVENT ENCONTRADO:', event);

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const organization = await this.prisma.organization.findUnique({
      where: {
        id: event.organizationId,
      },
      select: {
        id: true,
        name: true,
        paymentGateway: true,
        paymentAccountId: true,
        paymentAccountStatus: true,
        paymentAccountReady: true,
      },
    });

    console.log('ORGANIZATION ENCONTRADA:', organization);

    if (!organization) {
      throw new NotFoundException('Organização não encontrada.');
    }

    if (!organization.paymentAccountReady) {
      throw new BadRequestException(
        'A organização ainda não está pronta para receber pagamentos.',
      );
    }

    const gift = await this.prisma.gift.findFirst({
      where: {
        id: dto.giftId,
        eventId: dto.eventId,
        organizationId: event.organizationId,
      },
    });

    console.log('BUSCA DO GIFT COM FILTRO TRIPLO:', {
      giftId: dto.giftId,
      eventId: dto.eventId,
      organizationId: event.organizationId,
      giftEncontrado: gift,
    });

    if (!gift) {
      const giftByIdOnly = await this.prisma.gift.findFirst({
        where: {
          id: dto.giftId,
        },
      });

      const giftsByEvent = await this.prisma.gift.findMany({
        where: {
          eventId: dto.eventId,
        },
        select: {
          id: true,
          title: true,
          eventId: true,
          organizationId: true,
          isActive: true,
          isPurchased: true,
        },
      });

      console.log('GIFT BUSCADO APENAS POR ID:', giftByIdOnly);
      console.log('GIFTS DO EVENTO:', giftsByEvent);

      throw new NotFoundException('Presente não encontrado.');
    }

    if (!gift.isActive) {
      throw new BadRequestException('Este presente não está ativo.');
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Este presente já foi comprado.');
    }

    const payment = await this.prisma.payment.create({
      data: {
        organizationId: event.organizationId,
        eventId: dto.eventId,
        giftId: dto.giftId,
        buyerName: dto.buyerName,
        buyerEmail: dto.buyerEmail,
        buyerPhone: dto.buyerPhone,
        paymentMethod: dto.paymentMethod,
        amount: dto.amount,
        status: 'PENDING',
      },
    });

    console.log('PAYMENT CRIADO:', payment);

    const gatewayResponse = await this.paymentGatewayService.createPayment({
      paymentId: payment.id,
      organizationId: event.organizationId,
      eventId: dto.eventId,
      giftId: dto.giftId,
      buyerName: dto.buyerName,
      buyerEmail: dto.buyerEmail,
      buyerPhone: dto.buyerPhone,
      paymentMethod: dto.paymentMethod,
      amount: dto.amount,
    });

    console.log('GATEWAY RESPONSE:', gatewayResponse);

    const updatedPayment = await this.prisma.payment.update({
      where: {
        id: payment.id,
      },
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

    console.log('PAYMENT ATUALIZADO:', updatedPayment);
    console.log('================ PAYMENT DEBUG END =================');

    return {
      message: 'Pagamento público criado com sucesso.',
      payment: updatedPayment,
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

  async createPaymentIntent(organizationId: string, dto: CreatePaymentDto) {
    const organization = await this.prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        id: true,
        paymentGateway: true,
        paymentAccountId: true,
        paymentAccountStatus: true,
        paymentAccountReady: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada.');
    }

    if (!organization.paymentAccountReady) {
      throw new BadRequestException(
        'A organização ainda não está pronta para receber pagamentos.',
      );
    }

    const event = await this.prisma.event.findFirst({
      where: {
        id: dto.eventId,
        organizationId,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const gift = await this.prisma.gift.findFirst({
      where: {
        id: dto.giftId,
        eventId: dto.eventId,
        organizationId,
      },
    });

    if (!gift) {
      throw new NotFoundException('Presente não encontrado.');
    }

    if (!gift.isActive) {
      throw new BadRequestException('Este presente não está ativo.');
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Este presente já foi comprado.');
    }

    const payment = await this.prisma.payment.create({
      data: {
        organizationId,
        eventId: dto.eventId,
        giftId: dto.giftId,
        buyerName: dto.buyerName,
        buyerEmail: dto.buyerEmail,
        buyerPhone: dto.buyerPhone,
        paymentMethod: dto.paymentMethod,
        amount: dto.amount,
        status: 'PENDING',
      },
    });

    const gatewayResponse = await this.paymentGatewayService.createPayment({
      paymentId: payment.id,
      organizationId,
      eventId: dto.eventId,
      giftId: dto.giftId,
      buyerName: dto.buyerName,
      buyerEmail: dto.buyerEmail,
      buyerPhone: dto.buyerPhone,
      paymentMethod: dto.paymentMethod,
      amount: dto.amount,
    });

    const updatedPayment = await this.prisma.payment.update({
      where: {
        id: payment.id,
      },
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
      message: 'Pagamento criado com gateway Mercado Pago com sucesso.',
      payment: updatedPayment,
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

    const gift = await this.prisma.gift.findFirst({
      where: {
        id: payment.giftId,
        eventId: payment.eventId,
        organizationId,
      },
    });

    if (!gift) {
      throw new NotFoundException(
        'Presente vinculado ao pagamento não encontrado.',
      );
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Este presente já foi comprado.');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      });

      const updatedGift = await tx.gift.update({
        where: {
          id: gift.id,
        },
        data: {
          isPurchased: true,
          purchasedByName: payment.buyerName,
          purchasedAt: new Date(),
          isReserved: false,
          reservedByName: null,
          reservedAt: null,
        },
      });

      return {
        payment: updatedPayment,
        gift: updatedGift,
      };
    });

    return {
      message: 'Pagamento confirmado e presente marcado como comprado.',
      payment: result.payment,
      gift: result.gift,
    };
  }

  async processPublicMockWebhookPaid(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
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
      message: 'Webhook mock processado com sucesso.',
    };
  }

  async processMercadoPagoWebhook(body: any, query: any) {
    const notificationType =
      body?.type ||
      body?.topic ||
      query?.type ||
      query?.topic ||
      null;

    const mercadoPagoPaymentId =
      body?.data?.id ||
      query?.['data.id'] ||
      query?.id ||
      null;

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
      where: {
        id: externalReference,
      },
    });

    if (!payment) {
      return {
        received: true,
        ignored: true,
        message: 'Pagamento local não encontrado pelo external_reference.',
      };
    }

    await this.prisma.payment.update({
      where: {
        id: payment.id,
      },
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

    const result = await this.confirmPayment(
      payment.organizationId,
      payment.id,
    );

    return {
      received: true,
      approved: true,
      webhookEvent: 'payment.approved',
      payment: result.payment,
      gift: result.gift,
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