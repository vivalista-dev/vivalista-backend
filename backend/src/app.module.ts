import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

import { UsersModule } from './users/users.module';

import { PrismaModule } from './modules/prisma/prisma.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { EventModule } from './modules/event/event.module';
import { GiftModule } from './modules/gift/gift.module';
import { GuestModule } from './modules/guest/guest.module';
import { RsvpModule } from './modules/rsvp/rsvp.module';
import { PublicRsvpModule } from './modules/public-rsvp/public-rsvp.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationModule,
    EventModule,
    GiftModule,
    GuestModule,
    RsvpModule,
    PublicRsvpModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
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
