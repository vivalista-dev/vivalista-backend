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
} from '@nestjs/common'
import { EventService } from './event.service'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { Public } from '../../auth/public.decorator'

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.eventService.create(body, req.user.organizationId)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.eventService.findAll(req.user.organizationId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.eventService.findOne(id, req.user.organizationId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.eventService.update(id, body, req.user.organizationId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.eventService.remove(id, req.user.organizationId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/gifts/dashboard')
  findEventGiftDashboard(@Param('id') id: string, @Req() req: any) {
    return this.eventService.findEventGiftDashboard(id, req.user.organizationId)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/gifts')
  createGift(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.eventService.createGift(id, body, req.user.organizationId)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/gifts')
  findGiftsByEvent(@Param('id') id: string, @Req() req: any) {
    return this.eventService.findGiftsByEvent(id, req.user.organizationId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':eventId/gifts/:giftId')
  updateGift(
    @Param('eventId') eventId: string,
    @Param('giftId') giftId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.eventService.updateGift(
      eventId,
      giftId,
      body,
      req.user.organizationId,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':eventId/gifts/:giftId')
  removeGift(
    @Param('eventId') eventId: string,
    @Param('giftId') giftId: string,
    @Req() req: any,
  ) {
    return this.eventService.removeGift(
      eventId,
      giftId,
      req.user.organizationId,
    )
  }

  @Public()
  @Get('public/:slug/full')
  findPublicFullBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicFullBySlug(slug)
  }

  @Public()
  @Get('public/:slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicBySlug(slug)
  }

  @Public()
  @Get('public/:slug/stats')
  findPublicStatsBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicStatsBySlug(slug)
  }

  @Public()
  @Get('public/:slug/gifts')
  findPublicGiftsBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicGiftsBySlug(slug)
  }

  @Public()
  @Post('public/:slug/gifts/:giftId/reserve')
  reserveGiftBySlug(
    @Param('slug') slug: string,
    @Param('giftId') giftId: string,
    @Body() body: { reservedByName: string },
  ) {
    return this.eventService.reserveGiftBySlug(slug, giftId, body)
  }

  @Public()
  @Patch('public/:slug/gifts/:giftId/unreserve')
  unreserveGiftBySlug(
    @Param('slug') slug: string,
    @Param('giftId') giftId: string,
  ) {
    return this.eventService.unreserveGiftBySlug(slug, giftId)
  }

  @Public()
  @Post('public/:slug/gifts/:giftId/purchase')
  purchaseGiftBySlug(
    @Param('slug') slug: string,
    @Param('giftId') giftId: string,
    @Body() body: { purchasedByName: string },
  ) {
    return this.eventService.purchaseGiftBySlug(slug, giftId, body)
  }

  @Public()
  @Post('public/:slug/rsvp/lookup')
  lookupGuest(@Param('slug') slug: string, @Body() body: { code: string }) {
    return this.eventService.lookupGuestByCode(slug, body.code)
  }

  @Public()
  @Patch('public/:slug/rsvp/:code/confirm')
  confirmGuestRsvp(@Param('slug') slug: string, @Param('code') code: string) {
    return this.eventService.confirmGuestRsvp(slug, code)
  }

  @Public()
  @Patch('public/:slug/rsvp/:code/decline')
  declineGuestRsvp(@Param('slug') slug: string, @Param('code') code: string) {
    return this.eventService.declineGuestRsvp(slug, code)
  }
}