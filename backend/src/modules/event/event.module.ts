import { Module } from '@nestjs/common'
import { EventController } from './event.controller'
import { EventPublicController } from './event-public.controller'
import { EventService } from './event.service'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [EventController, EventPublicController],
  providers: [EventService, PrismaService],
})
export class EventModule {}