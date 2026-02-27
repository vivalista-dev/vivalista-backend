import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      organizationId: number;
    },
  ) {
    return this.usersService.create(body);
  }
}