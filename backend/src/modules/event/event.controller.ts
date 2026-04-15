import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/roles.enum';
import { Public } from '../../auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

type AuthenticatedRequest = Request & {
  user: {
    sub?: string;
    email?: string;
    role?: string;
    organizationId: string;
  };
};

function ensureEventCoverUploadDir() {
  const uploadPath = join(process.cwd(), 'uploads', 'events', 'covers');

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
}

function ensureGiftImageUploadDir() {
  const uploadPath = join(process.cwd(), 'uploads', 'gifts', 'images');

  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
}

function buildSafeFileName(originalName: string) {
  const extension = extname(originalName || '').toLowerCase();
  const baseName = (originalName || 'imagem')
    .replace(extension, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

  const safeBaseName = baseName || 'imagem';
  const timestamp = Date.now();

  return `${safeBaseName}-${timestamp}${extension}`;
}

function imageFileFilter(
  _req: Request,
  file: any,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        'Arquivo inválido. Envie uma imagem JPG, JPEG, PNG ou WEBP.',
      ),
      false,
    );
  }

  callback(null, true);
}

function buildImageUploadInterceptor(
  getDestination: () => string,
) {
  return FileInterceptor('file', {
    storage: diskStorage({
      destination: (_req, _file, callback) => {
        const uploadDir = getDestination();
        callback(null, uploadDir);
      },
      filename: (_req, file, callback) => {
        callback(null, buildSafeFileName(file.originalname));
      },
    }),
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
}

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  private getOrganizationId(req: AuthenticatedRequest) {
    return req.user.organizationId;
  }

  // =========================
  // ROTAS PROTEGIDAS - EVENTO
  // =========================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  create(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    return this.eventService.create(body, this.getOrganizationId(req));
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findAll(@Req() req: AuthenticatedRequest) {
    return this.eventService.findAll(this.getOrganizationId(req));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.eventService.findOne(id, this.getOrganizationId(req));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventService.update(id, body, this.getOrganizationId(req));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.eventService.remove(id, this.getOrganizationId(req));
  }

  // =========================
  // ROTAS PROTEGIDAS - CAPA E VISUAL
  // =========================

  @Post(':id/cover-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @UseInterceptors(buildImageUploadInterceptor(ensureEventCoverUploadDir))
  uploadCoverImage(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    const imageUrl = `/uploads/events/covers/${file.filename}`;

    return this.eventService.updateCoverImage(
      id,
      imageUrl,
      this.getOrganizationId(req),
    );
  }

  @Get(':id/visual')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findVisualSettings(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventService.findVisualSettings(
      id,
      this.getOrganizationId(req),
    );
  }

  @Patch(':id/visual')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  updateVisualSettings(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventService.updateVisualSettings(
      id,
      body,
      this.getOrganizationId(req),
    );
  }

  // =========================
  // ROTAS PROTEGIDAS - PRESENTES
  // =========================

  @Get(':id/gifts/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findEventGiftDashboard(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventService.findEventGiftDashboard(
      id,
      this.getOrganizationId(req),
    );
  }

  @Post(':id/gifts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  createGift(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventService.createGift(id, body, this.getOrganizationId(req));
  }

  @Get(':id/gifts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findGiftsByEvent(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.eventService.findGiftsByEvent(id, this.getOrganizationId(req));
  }

  @Patch(':eventId/gifts/:giftId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  updateGift(
    @Param('eventId') eventId: string,
    @Param('giftId') giftId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventService.updateGift(
      eventId,
      giftId,
      body,
      this.getOrganizationId(req),
    );
  }

  @Post(':eventId/gifts/:giftId/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @UseInterceptors(buildImageUploadInterceptor(ensureGiftImageUploadDir))
  uploadGiftImage(
    @Param('eventId') eventId: string,
    @Param('giftId') giftId: string,
    @UploadedFile() file: any,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    const imageUrl = `/uploads/gifts/images/${file.filename}`;

    return this.eventService.updateGiftImage(
      eventId,
      giftId,
      imageUrl,
      this.getOrganizationId(req),
    );
  }

  @Delete(':eventId/gifts/:giftId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  removeGift(
    @Param('eventId') eventId: string,
    @Param('giftId') giftId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventService.removeGift(
      eventId,
      giftId,
      this.getOrganizationId(req),
    );
  }

  // =========================
  // ROTAS PROTEGIDAS - CONVIDADOS
  // =========================

  @Post(':id/guests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  createGuest(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventService.createGuest(id, body, this.getOrganizationId(req));
  }

  @Get(':id/guests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findGuestsByEvent(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.eventService.findGuestsByEvent(id, this.getOrganizationId(req));
  }

  @Get(':id/guests/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  findEventGuestDashboard(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventService.findEventGuestDashboard(
      id,
      this.getOrganizationId(req),
    );
  }

  // =========================
  // ROTAS PÚBLICAS - EVENTO
  // =========================

  @Public()
  @Get('public/:slug/full')
  findPublicFullBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicFullBySlug(slug);
  }

  @Public()
  @Get('public/:slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicBySlug(slug);
  }

  @Public()
  @Get('public/:slug/stats')
  findPublicStatsBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicStatsBySlug(slug);
  }

  @Public()
  @Get('public/:slug/financial-summary')
  findPublicFinancialSummaryBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicFinancialSummaryBySlug(slug);
  }

  // =========================
  // ROTAS PÚBLICAS - PRESENTES
  // =========================

  @Public()
  @Get('public/:slug/gifts')
  findPublicGiftsBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicGiftsBySlug(slug);
  }

  @Public()
  @Get('public/:slug/contributions')
  findPublicContributionsBySlug(@Param('slug') slug: string) {
    return this.eventService.findPublicContributionsBySlug(slug);
  }

  @Public()
  @Post('public/:slug/gifts/:giftId/reserve')
  reserveGiftBySlug(
    @Param('slug') slug: string,
    @Param('giftId') giftId: string,
    @Body() body: { reservedByName: string },
  ) {
    return this.eventService.reserveGiftBySlug(slug, giftId, body);
  }

  @Public()
  @Patch('public/:slug/gifts/:giftId/unreserve')
  unreserveGiftBySlug(
    @Param('slug') slug: string,
    @Param('giftId') giftId: string,
  ) {
    return this.eventService.unreserveGiftBySlug(slug, giftId);
  }

  @Public()
  @Post('public/:slug/gifts/:giftId/purchase')
  purchaseGiftBySlug(
    @Param('slug') slug: string,
    @Param('giftId') giftId: string,
    @Body() body: { purchasedByName: string },
  ) {
    return this.eventService.purchaseGiftBySlug(slug, giftId, body);
  }

  // =========================
  // ROTAS PÚBLICAS - RSVP
  // =========================

  @Public()
  @Post('public/:slug/rsvp/lookup')
  lookupGuest(@Param('slug') slug: string, @Body() body: { code: string }) {
    return this.eventService.lookupGuestByCode(slug, body.code);
  }

  @Public()
  @Patch('public/:slug/rsvp/:code/confirm')
  confirmGuestRsvp(@Param('slug') slug: string, @Param('code') code: string) {
    return this.eventService.confirmGuestRsvp(slug, code);
  }

  @Public()
  @Patch('public/:slug/rsvp/:code/decline')
  declineGuestRsvp(@Param('slug') slug: string, @Param('code') code: string) {
    return this.eventService.declineGuestRsvp(slug, code);
  }
}