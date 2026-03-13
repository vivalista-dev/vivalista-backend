import { Controller, Get, Param } from '@nestjs/common'
import { EventService } from './event.service'

@Controller('e')
export class EventPublicController {
  constructor(private readonly eventService: EventService) {}

  @Get(':slug')
  findPublicEvent(@Param('slug') slug: string) {
    return this.eventService.findPublicBySlug(slug)
  }
}