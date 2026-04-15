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
import { Request } from 'express';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/roles.enum';

type AuthenticatedRequest = Request & {
  user: {
    sub?: string;
    email?: string;
    role?: Role;
    organizationId: string;
  };
};

@Controller('events/:eventId/guests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  // =========================
  // CRIAÇÃO
  // =========================

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Req() req: AuthenticatedRequest,
    @Param('eventId') eventId: string,
    @Body() dto: CreateGuestDto,
  ) {
    return this.guestService.create(req.user.organizationId, eventId, dto);
  }

  // =========================
  // LEITURA
  // =========================

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findAll(
    @Req() req: AuthenticatedRequest,
    @Param('eventId') eventId: string,
  ) {
    return this.guestService.findAllByEvent(req.user.organizationId, eventId);
  }

  @Get(':guestId')
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
  ) {
    return this.guestService.findOne(
      req.user.organizationId,
      eventId,
      guestId,
    );
  }

  // =========================
  // ATUALIZAÇÃO
  // =========================

  @Patch(':guestId')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Req() req: AuthenticatedRequest,
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
    @Body() dto: UpdateGuestDto,
  ) {
    return this.guestService.update(
      req.user.organizationId,
      eventId,
      guestId,
      dto,
    );
  }

  // =========================
  // REMOÇÃO
  // =========================

  @Delete(':guestId')
  @Roles(Role.OWNER, Role.ADMIN)
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('eventId') eventId: string,
    @Param('guestId') guestId: string,
  ) {
    return this.guestService.remove(
      req.user.organizationId,
      eventId,
      guestId,
    );
  }
}