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
    userId: string;
    email: string;
    role: Role;
    organizationId: string;
  };
};

@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
  ) {}

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get('me/payment-settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  getMyPaymentSettings(@Req() req: AuthenticatedRequest) {
    return this.organizationService.getPaymentSettings(req.user.organizationId);
  }

  @Patch('me/payment-settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}