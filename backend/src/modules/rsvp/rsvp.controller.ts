import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { Public } from '../../auth/public.decorator';
import { GuestStatus } from '@prisma/client';

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Public()
  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.rsvpService.findByCode(code);
  }

  @Public()
  @Patch(':code')
  updateStatus(
    @Param('code') code: string,
    @Body() body: { status: GuestStatus },
  ) {
    return this.rsvpService.updateStatus(code, body.status);
  }
}