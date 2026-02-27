import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    OrganizationModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}