import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventModule } from './modules/event/event.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { GuestModule } from './modules/guest/guest.module';
import { RsvpModule } from './modules/rsvp/rsvp.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PublicRsvpModule } from './modules/public-rsvp/public-rsvp.module';

import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    EventModule,
    OrganizationModule,
    PrismaModule,
    GuestModule,
    RsvpModule,
    PaymentModule,
    PublicRsvpModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}