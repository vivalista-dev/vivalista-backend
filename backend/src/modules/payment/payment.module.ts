import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentGatewayService } from './gateways/payment-gateway.service';
import { MockPaymentGatewayService } from './gateways/mock-payment-gateway.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: PaymentGatewayService,
      useClass: MockPaymentGatewayService,
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}