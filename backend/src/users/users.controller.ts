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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.usersService.findOne(id, req.user.organizationId);
  }

  @Patch(':id/role')
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
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(id, req.user.organizationId);
  }
}