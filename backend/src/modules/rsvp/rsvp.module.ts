import { Module } from '@nestjs/common'
import { RsvpController } from './rsvp.controller'
import { RsvpService } from './rsvp.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [RsvpController],
  providers: [RsvpService],
})
export class RsvpModule {}