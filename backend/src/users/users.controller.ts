import {
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Body,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { Role as AppRole } from '../auth/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(AppRole.OWNER, AppRole.ADMIN)
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.organizationId);
  }

  @Get(':id')
  @Roles(AppRole.OWNER, AppRole.ADMIN)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.usersService.findOne(id, req.user.organizationId);
  }

  @Patch(':id/role')
  @Roles(AppRole.OWNER)
  updateRole(
    @Param('id') id: string,
    @Body('role') role: Role,
    @Req() req: any,
  ) {
    return this.usersService.updateRole(
      id,
      req.user.organizationId,
      role,
    );
  }

  @Delete(':id')
  @Roles(AppRole.OWNER)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(id, req.user.organizationId);
  }
}