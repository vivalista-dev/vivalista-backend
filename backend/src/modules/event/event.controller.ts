import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.eventService.create({
      ...body,
      organizationId: req.user.organizationId,
    });
  }

  @Get()
  findAll(@Req() req: any) {
    return this.eventService.findAll(req.user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.eventService.findOne(id, req.user.organizationId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.eventService.update(
      id,
      req.user.organizationId,
      body,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.eventService.remove(id, req.user.organizationId);
  }
}