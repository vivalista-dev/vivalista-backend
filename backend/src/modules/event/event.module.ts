import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventSectionMediaController } from './event-section-media.controller';
import { EventSectionMediaService } from './event-section-media.service';

@Module({
  imports: [PrismaModule],
  controllers: [EventController, EventSectionMediaController],
  providers: [EventService, EventSectionMediaService],
  exports: [EventService, EventSectionMediaService],
})
export class EventModule {}
