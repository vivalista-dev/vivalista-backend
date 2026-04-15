import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from '../../auth/public.decorator';
import { PublicRsvpService } from './public-rsvp.service';

type PublicRsvpRespondBody = {
  status: 'CONFIRMED' | 'DECLINED';
};

@Public()
@Controller('public/rsvp')
export class PublicRsvpController {
  constructor(private readonly service: PublicRsvpService) {}

  // =========================
  // LOOKUP PÚBLICO POR CÓDIGO
  // =========================

  @Get(':code')
  getGuest(@Param('code') code: string) {
    return this.service.findGuestByCode(code);
  }

  // =========================
  // RESPOSTA PÚBLICA DO RSVP
  // =========================

  @Post(':code/respond')
  respond(
    @Param('code') code: string,
    @Body() body: PublicRsvpRespondBody,
  ) {
    return this.service.respond(code, body.status);
  }
}