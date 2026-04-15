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
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/roles.enum';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';

type AuthenticatedRequest = Request & {
  user: {
    userId?: string;
    sub?: string;
    email: string;
    role: Role;
    organizationId: string;
  };
};

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
  ) {}

  // =========================
  // LEITURA ADMINISTRATIVA
  // =========================

  @Get()
  @Roles(Role.OWNER, Role.ADMIN)
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  // =========================
  // CONTEXTO DA ORGANIZAÇÃO LOGADA
  // =========================

  @Get('me/payment-settings')
  @Roles(Role.OWNER, Role.ADMIN)
  getMyPaymentSettings(@Req() req: AuthenticatedRequest) {
    return this.organizationService.getPaymentSettings(req.user.organizationId);
  }

  @Patch('me/payment-settings')
  @Roles(Role.OWNER)
  updateMyPaymentSettings(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePaymentSettingsDto,
  ) {
    return this.organizationService.updatePaymentSettings(
      req.user.organizationId,
      dto,
    );
  }

  // =========================
  // REMOÇÃO ADMINISTRATIVA
  // =========================

  @Delete(':id')
  @Roles(Role.OWNER)
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}