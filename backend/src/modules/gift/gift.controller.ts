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
import { GiftService } from './gift.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
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

@Controller('events/:eventId/gifts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  // =========================
  // LEITURA
  // =========================

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findAll(
    @Param('eventId') eventId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.giftService.findAllByEvent(
      eventId,
      req.user.organizationId,
    );
  }

  @Get(':giftId')
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findOne(
    @Param('eventId') eventId: string,
    @Param('giftId') giftId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.giftService.findOne(
      eventId,
      giftId,
      req.user.organizationId,
    );
  }

  // =========================
  // CRIAÇÃO
  // =========================

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Param('eventId') eventId: string,
    @Body() dto: CreateGiftDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.giftService.create(
      eventId,
      req.user.organizationId,
      dto,
    );
  }

  // =========================
  // ATUALIZAÇÃO
  // =========================

  @Patch(':giftId')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('eventId') eventId: string,
    @Param('giftId') giftId: string,
    @Body() dto: UpdateGiftDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.giftService.update(
      eventId,
      giftId,
      req.user.organizationId,
      dto,
    );
  }

  // =========================
  // REMOÇÃO
  // =========================

  @Delete(':giftId')
  @Roles(Role.OWNER, Role.ADMIN)
  remove(
    @Param('eventId') eventId: string,
    @Param('giftId') giftId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.giftService.remove(
      eventId,
      giftId,
      req.user.organizationId,
    );
  }
}