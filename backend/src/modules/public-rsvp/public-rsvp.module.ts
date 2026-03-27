import { Module } from '@nestjs/common';
import { PublicRsvpController } from './public-rsvp.controller';
import { PublicRsvpService } from './public-rsvp.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PublicRsvpController],
  providers: [PublicRsvpService, PrismaService],
})
export class PublicRsvpModule {}