
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/roles.enum';
import { Public } from '../../auth/public.decorator';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email: string;
    role: Role;
    organizationId: string;
  };
};

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Get('status')
  getStatus() {
    return this.paymentService.getModuleStatus();
  }

  // =========================
  // ROTAS PÚBLICAS
  // =========================

  @Public()
  @Post('public/intent')
  createPublicPaymentIntent(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPublicPaymentIntent(dto);
  }

  @Public()
  @Post('public/mock/:paymentId/paid')
  processPublicMockWebhookPaid(@Param('paymentId') paymentId: string) {
    return this.paymentService.processPublicMockWebhookPaid(paymentId);
  }

  @Public()
  @Post('webhook/mercadopago')
  processMercadoPagoWebhook(@Body() body: any, @Query() query: any) {
    return this.paymentService.processMercadoPagoWebhook(body, query);
  }

  // =========================
  // ROTAS PROTEGIDAS
  // =========================

  @Post('intent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  createPaymentIntent(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentService.createPaymentIntent(
      req.user.organizationId,
      dto,
    );
  }

  @Post(':paymentId/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  confirmPayment(
    @Req() req: AuthenticatedRequest,
    @Param('paymentId') paymentId: string,
  ) {
    return this.paymentService.confirmPayment(
      req.user.organizationId,
      paymentId,
    );
  }

  @Post('webhook/mock/:paymentId/paid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  processMockWebhookPaid(
    @Req() req: AuthenticatedRequest,
    @Param('paymentId') paymentId: string,
  ) {
    return this.paymentService.processMockWebhookPaid(
      req.user.organizationId,
      paymentId,
    );
  }
}
