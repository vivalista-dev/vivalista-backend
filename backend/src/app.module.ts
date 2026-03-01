import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './modules/event/event.module';

@Module({
  imports: [
    PrismaModule,
    OrganizationModule,
    UsersModule,
    AuthModule,
    EventModule,
  ],
})
export class AppModule {}