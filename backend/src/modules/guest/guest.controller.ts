import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/roles.enum';

@Controller('events/:eventId/guests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Body() dto: CreateGuestDto,
  ) {
    const organizationId = req.user.organizationId;
    return this.guestService.create(organizationId, eventId, dto);
  }

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findAll(@Req() req: any, @Param('eventId') eventId: string) {
    const organizationId = req.user.organizationId;
    return this.guestService.findAllByEvent(organizationId, eventId);
  }

  @Get(':guestId')
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findOne(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
  ) {
    const organizationId = req.user.organizationId;
    return this.guestService.findOne(organizationId, eventId, guestId);
  }

  @Patch(':guestId')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
    @Body() dto: UpdateGuestDto,
  ) {
    const organizationId = req.user.organizationId;
    return this.guestService.update(organizationId, eventId, guestId, dto);
  }

  @Delete(':guestId')
  @Roles(Role.OWNER, Role.ADMIN)
  remove(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
  ) {
    const organizationId = req.user.organizationId;
    return this.guestService.remove(organizationId, eventId, guestId);
  }
}