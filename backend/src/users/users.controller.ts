import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role as AppRole } from '../auth/roles.enum';

type AuthenticatedRequest = Request & {
  user: {
    sub?: string;
    email?: string;
    role?: AppRole;
    organizationId: string;
  };
};

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // =========================
  // LEITURA
  // =========================

  @Get()
  @Roles(AppRole.OWNER, AppRole.ADMIN)
  findAll(@Req() req: AuthenticatedRequest) {
    return this.usersService.findAll(req.user.organizationId);
  }

  @Get(':id')
  @Roles(AppRole.OWNER, AppRole.ADMIN)
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.findOne(id, req.user.organizationId);
  }

  // =========================
  // ATUALIZAÇÃO
  // =========================

  @Patch(':id/role')
  @Roles(AppRole.OWNER)
  updateRole(
    @Param('id') id: string,
    @Body('role') role: Role,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.updateRole(
      id,
      req.user.organizationId,
      role,
    );
  }

  // =========================
  // REMOÇÃO
  // =========================

  @Delete(':id')
  @Roles(AppRole.OWNER)
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.remove(id, req.user.organizationId);
  }
}