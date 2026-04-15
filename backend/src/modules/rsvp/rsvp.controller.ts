import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { GuestStatus } from '@prisma/client';
import { Public } from '../../auth/public.decorator';
import { RsvpService } from './rsvp.service';

type UpdateRsvpStatusBody = {
  status: GuestStatus;
};

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  // =========================
  // LOOKUP POR CÓDIGO
  // =========================

  @Public()
  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.rsvpService.findByCode(code);
  }

  // =========================
  // ATUALIZAÇÃO DE STATUS
  // =========================

  @Public()
  @Patch(':code')
  updateStatus(
    @Param('code') code: string,
    @Body() body: UpdateRsvpStatusBody,
  ) {
    return this.rsvpService.updateStatus(code, body.status);
  }
}