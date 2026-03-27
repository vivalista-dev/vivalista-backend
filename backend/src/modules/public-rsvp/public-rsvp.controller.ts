import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '../../auth/public.decorator';
import { PublicRsvpService } from './public-rsvp.service';

@Public()
@Controller('public/rsvp')
export class PublicRsvpController {
  constructor(private readonly service: PublicRsvpService) {}

  @Get(':code')
  getGuest(@Param('code') code: string) {
    return this.service.findGuestByCode(code);
  }

  @Post(':code/respond')
  respond(
    @Param('code') code: string,
    @Body() body: { status: 'CONFIRMED' | 'DECLINED' },
  ) {
    return this.service.respond(code, body.status);
  }
}