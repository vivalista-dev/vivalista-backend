import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { EventSectionMediaService } from './event-section-media.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../auth/roles.enum';
import { Public } from '../../auth/public.decorator';

type AuthenticatedRequest = Request & {
  user: {
    sub?: string;
    email?: string;
    role?: string;
    organizationId: string;
  };
};

function ensureEventSectionMediaUploadDir() {
  const uploadPath = join(process.cwd(), 'uploads', 'events', 'sections');

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

const sectionMediaUploadInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: (_req, _file, callback) => {
      const uploadDir = ensureEventSectionMediaUploadDir();
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

@Controller('events')
export class EventSectionMediaController {
  constructor(
    private readonly eventSectionMediaService: EventSectionMediaService,
  ) {}

  private getOrganizationId(req: AuthenticatedRequest) {
    return req.user.organizationId;
  }

  // =========================
  // ROTAS PROTEGIDAS
  // =========================

  @Get(':eventId/section-media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN, Role.STAFF)
  listByEvent(
    @Param('eventId') eventId: string,
    @Query('sectionKey') sectionKey: string | undefined,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventSectionMediaService.listByEvent(
      eventId,
      this.getOrganizationId(req),
      sectionKey,
    );
  }

  @Post(':eventId/section-media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Param('eventId') eventId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventSectionMediaService.create(
      eventId,
      body,
      this.getOrganizationId(req),
    );
  }

  @Post(':eventId/section-media/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @UseInterceptors(sectionMediaUploadInterceptor)
  upload(
    @Param('eventId') eventId: string,
    @UploadedFile() file: any,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    const imageUrl = `/uploads/events/sections/${file.filename}`;

    return this.eventSectionMediaService.createUploadedMedia(
      eventId,
      imageUrl,
      body,
      this.getOrganizationId(req),
    );
  }

  @Patch(':eventId/section-media/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  reorder(
    @Param('eventId') eventId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventSectionMediaService.reorder(
      eventId,
      body,
      this.getOrganizationId(req),
    );
  }

  @Patch(':eventId/section-media/:mediaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('eventId') eventId: string,
    @Param('mediaId') mediaId: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventSectionMediaService.update(
      eventId,
      mediaId,
      body,
      this.getOrganizationId(req),
    );
  }

  @Delete(':eventId/section-media/:mediaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  remove(
    @Param('eventId') eventId: string,
    @Param('mediaId') mediaId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventSectionMediaService.remove(
      eventId,
      mediaId,
      this.getOrganizationId(req),
    );
  }

  // =========================
  // ROTA PÚBLICA
  // =========================

  @Public()
  @Get('public/:slug/section-media')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.eventSectionMediaService.findPublicBySlug(slug);
  }
}
