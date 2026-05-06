import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

type SectionKey =
  | 'INVITATION'
  | 'HERO'
  | 'COUPLE'
  | 'STORY'
  | 'GALLERY'
  | 'RECEPTION'
  | 'INFO'
  | 'MENU'
  | 'LOCATION'
  | 'ACCOMMODATION'
  | 'GIFTS'
  | 'DEFAULT_GIFT'
  | 'RSVP';

type EventSectionMediaRow = {
  id: string;
  eventId: string;
  organizationId: string;
  sectionKey: SectionKey;
  mediaRole: string | null;
  imageUrl: string;
  title: string | null;
  description: string | null;
  linkUrl: string | null;
  buttonLabel: string | null;
  metadata: any | null;
  displayOrder: number;
  isActive: boolean;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const VALID_SECTION_KEYS: SectionKey[] = [
  'INVITATION',
  'HERO',
  'COUPLE',
  'STORY',
  'GALLERY',
  'RECEPTION',
  'INFO',
  'MENU',
  'LOCATION',
  'ACCOMMODATION',
  'GIFTS',
  'DEFAULT_GIFT',
  'RSVP',
];

const SINGLE_IMAGE_SECTIONS: SectionKey[] = [
  'INVITATION',
  'HERO',
  'RECEPTION',
  'LOCATION',
  'ACCOMMODATION',
  'DEFAULT_GIFT',
];

@Injectable()
export class EventSectionMediaService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeOptionalString(value: any): string | null | undefined {
    if (value === undefined) return undefined;
    if (value === null) return null;

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : null;
  }

  private normalizeRequiredString(value: any, fieldLabel: string): string {
    const normalized = this.normalizeOptionalString(value);

    if (!normalized) {
      throw new BadRequestException(`${fieldLabel} é obrigatório.`);
    }

    return normalized;
  }

  private normalizeOptionalBoolean(value: any): boolean | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();

      if (normalized === 'true' || normalized === '1' || normalized === 'sim') {
        return true;
      }

      if (normalized === 'false' || normalized === '0' || normalized === 'nao' || normalized === 'não') {
        return false;
      }
    }

    return Boolean(value);
  }

  private normalizeOptionalNumber(value: any): number | undefined {
    if (value === undefined || value === null || value === '') return undefined;

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new BadRequestException('Valor numérico inválido.');
    }

    return parsed;
  }

  private normalizeSectionKey(value: any): SectionKey {
    const normalized = this.normalizeRequiredString(value, 'sectionKey')
      .toUpperCase()
      .replace(/[^A-Z_]/g, '_') as SectionKey;

    if (!VALID_SECTION_KEYS.includes(normalized)) {
      throw new BadRequestException(
        `sectionKey inválido. Use um destes: ${VALID_SECTION_KEYS.join(', ')}.`,
      );
    }

    return normalized;
  }

  private normalizeMetadata(value: any): any | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;

    if (typeof value === 'object') return value;

    try {
      return JSON.parse(String(value));
    } catch {
      throw new BadRequestException('metadata deve ser um JSON válido.');
    }
  }

  private mapMedia(row: EventSectionMediaRow) {
    return {
      id: row.id,
      eventId: row.eventId,
      organizationId: row.organizationId,
      sectionKey: row.sectionKey,
      mediaRole: row.mediaRole,
      imageUrl: row.imageUrl,
      title: row.title,
      description: row.description,
      linkUrl: row.linkUrl,
      buttonLabel: row.buttonLabel,
      metadata: row.metadata,
      displayOrder: row.displayOrder,
      isActive: row.isActive,
      isPrimary: row.isPrimary,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private groupMediaBySection(rows: EventSectionMediaRow[]) {
    const sections = VALID_SECTION_KEYS.reduce(
      (acc, sectionKey) => {
        acc[sectionKey] = [];
        return acc;
      },
      {} as Record<SectionKey, ReturnType<EventSectionMediaService['mapMedia']>[]>,
    );

    for (const row of rows) {
      sections[row.sectionKey].push(this.mapMedia(row));
    }

    return sections;
  }

  private async findEventByIdAndOrg(eventId: string, organizationId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        organizationId: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    return event;
  }

  private async findPublicEventBySlug(slug: string) {
    const event = await this.prisma.event.findFirst({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        organizationId: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    if (event.status !== 'PUBLISHED') {
      throw new NotFoundException('Evento não publicado.');
    }

    return event;
  }

  private async findMediaByIdEventAndOrg(
    mediaId: string,
    eventId: string,
    organizationId: string,
  ) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    const rows = await this.prisma.$queryRaw<EventSectionMediaRow[]>`
      SELECT *
      FROM "EventSectionMedia"
      WHERE "id" = ${mediaId}
        AND "eventId" = ${eventId}
        AND "organizationId" = ${organizationId}
      LIMIT 1
    `;

    const media = rows[0];

    if (!media) {
      throw new NotFoundException('Imagem da seção não encontrada.');
    }

    return media;
  }

  private async getNextDisplayOrder(
    eventId: string,
    organizationId: string,
    sectionKey: SectionKey,
  ) {
    const rows = await this.prisma.$queryRaw<Array<{ nextOrder: number | null }>>`
      SELECT COALESCE(MAX("displayOrder"), 0) + 1 AS "nextOrder"
      FROM "EventSectionMedia"
      WHERE "eventId" = ${eventId}
        AND "organizationId" = ${organizationId}
        AND "sectionKey" = ${sectionKey}
    `;

    return rows[0]?.nextOrder ?? 1;
  }

  private async clearPrimaryForSection(
    eventId: string,
    organizationId: string,
    sectionKey: SectionKey,
  ) {
    await this.prisma.$executeRaw`
      UPDATE "EventSectionMedia"
      SET "isPrimary" = false,
          "updatedAt" = NOW()
      WHERE "eventId" = ${eventId}
        AND "organizationId" = ${organizationId}
        AND "sectionKey" = ${sectionKey}
    `;
  }

  private async syncEventVisualFields(
    eventId: string,
    sectionKey: SectionKey,
    imageUrl: string,
    isPrimary: boolean,
  ) {
    if (!isPrimary) return;

    if (sectionKey === 'HERO') {
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          coverImage: imageUrl,
          heroImageUrl: imageUrl,
        },
      });
    }

    if (sectionKey === 'INVITATION') {
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          coverImage: imageUrl,
        },
      });
    }
  }

  async listByEvent(eventId: string, organizationId: string, sectionKey?: string) {
    const event = await this.findEventByIdAndOrg(eventId, organizationId);
    const normalizedSectionKey = sectionKey
      ? this.normalizeSectionKey(sectionKey)
      : undefined;

    const rows = normalizedSectionKey
      ? await this.prisma.$queryRaw<EventSectionMediaRow[]>`
          SELECT *
          FROM "EventSectionMedia"
          WHERE "eventId" = ${eventId}
            AND "organizationId" = ${organizationId}
            AND "sectionKey" = ${normalizedSectionKey}
          ORDER BY "displayOrder" ASC, "createdAt" ASC
        `
      : await this.prisma.$queryRaw<EventSectionMediaRow[]>`
          SELECT *
          FROM "EventSectionMedia"
          WHERE "eventId" = ${eventId}
            AND "organizationId" = ${organizationId}
          ORDER BY "sectionKey" ASC, "displayOrder" ASC, "createdAt" ASC
        `;

    return {
      event,
      media: rows.map((row) => this.mapMedia(row)),
      sections: this.groupMediaBySection(rows),
      availableSections: VALID_SECTION_KEYS,
    };
  }

  async findPublicBySlug(slug: string) {
    const event = await this.findPublicEventBySlug(slug);

    const rows = await this.prisma.$queryRaw<EventSectionMediaRow[]>`
      SELECT *
      FROM "EventSectionMedia"
      WHERE "eventId" = ${event.id}
        AND "isActive" = true
      ORDER BY "sectionKey" ASC, "displayOrder" ASC, "createdAt" ASC
    `;

    return {
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
      },
      media: rows.map((row) => this.mapMedia(row)),
      sections: this.groupMediaBySection(rows),
      availableSections: VALID_SECTION_KEYS,
    };
  }

  async create(eventId: string, body: any, organizationId: string) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    const sectionKey = this.normalizeSectionKey(body?.sectionKey);
    const imageUrl = this.normalizeRequiredString(body?.imageUrl, 'imageUrl');
    const mediaRole = this.normalizeOptionalString(body?.mediaRole) ?? null;
    const title = this.normalizeOptionalString(body?.title) ?? null;
    const description = this.normalizeOptionalString(body?.description) ?? null;
    const linkUrl = this.normalizeOptionalString(body?.linkUrl) ?? null;
    const buttonLabel = this.normalizeOptionalString(body?.buttonLabel) ?? null;
    const metadata = this.normalizeMetadata(body?.metadata) ?? null;
    const displayOrder =
      this.normalizeOptionalNumber(body?.displayOrder) ??
      (await this.getNextDisplayOrder(eventId, organizationId, sectionKey));
    const isActive = this.normalizeOptionalBoolean(body?.isActive) ?? true;
    const isPrimary =
      this.normalizeOptionalBoolean(body?.isPrimary) ??
      SINGLE_IMAGE_SECTIONS.includes(sectionKey);

    if (isPrimary || SINGLE_IMAGE_SECTIONS.includes(sectionKey)) {
      await this.clearPrimaryForSection(eventId, organizationId, sectionKey);
    }

    const id = randomUUID();
    const metadataJson = JSON.stringify(metadata);

    const rows = await this.prisma.$queryRaw<EventSectionMediaRow[]>`
      INSERT INTO "EventSectionMedia" (
        "id",
        "eventId",
        "organizationId",
        "sectionKey",
        "mediaRole",
        "imageUrl",
        "title",
        "description",
        "linkUrl",
        "buttonLabel",
        "metadata",
        "displayOrder",
        "isActive",
        "isPrimary",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${id},
        ${eventId},
        ${organizationId},
        ${sectionKey},
        ${mediaRole},
        ${imageUrl},
        ${title},
        ${description},
        ${linkUrl},
        ${buttonLabel},
        CAST(${metadataJson} AS jsonb),
        ${displayOrder},
        ${isActive},
        ${isPrimary},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    const media = rows[0];
    await this.syncEventVisualFields(eventId, sectionKey, imageUrl, isPrimary);

    return {
      message: 'Imagem da seção adicionada com sucesso.',
      media: this.mapMedia(media),
    };
  }

  async createUploadedMedia(
    eventId: string,
    imageUrl: string,
    body: any,
    organizationId: string,
  ) {
    return this.create(
      eventId,
      {
        ...body,
        imageUrl,
      },
      organizationId,
    );
  }

  async update(
    eventId: string,
    mediaId: string,
    body: any,
    organizationId: string,
  ) {
    const currentMedia = await this.findMediaByIdEventAndOrg(
      mediaId,
      eventId,
      organizationId,
    );

    const sectionKey = body?.sectionKey
      ? this.normalizeSectionKey(body.sectionKey)
      : currentMedia.sectionKey;
    const imageUrl =
      body?.imageUrl !== undefined
        ? this.normalizeRequiredString(body.imageUrl, 'imageUrl')
        : currentMedia.imageUrl;
    const mediaRole =
      body?.mediaRole !== undefined
        ? this.normalizeOptionalString(body.mediaRole) ?? null
        : currentMedia.mediaRole;
    const title =
      body?.title !== undefined
        ? this.normalizeOptionalString(body.title) ?? null
        : currentMedia.title;
    const description =
      body?.description !== undefined
        ? this.normalizeOptionalString(body.description) ?? null
        : currentMedia.description;
    const linkUrl =
      body?.linkUrl !== undefined
        ? this.normalizeOptionalString(body.linkUrl) ?? null
        : currentMedia.linkUrl;
    const buttonLabel =
      body?.buttonLabel !== undefined
        ? this.normalizeOptionalString(body.buttonLabel) ?? null
        : currentMedia.buttonLabel;
    const metadata =
      body?.metadata !== undefined
        ? this.normalizeMetadata(body.metadata) ?? null
        : currentMedia.metadata;
    const displayOrder =
      body?.displayOrder !== undefined
        ? this.normalizeOptionalNumber(body.displayOrder) ?? currentMedia.displayOrder
        : currentMedia.displayOrder;
    const isActive =
      body?.isActive !== undefined
        ? this.normalizeOptionalBoolean(body.isActive) ?? true
        : currentMedia.isActive;
    const isPrimary =
      body?.isPrimary !== undefined
        ? this.normalizeOptionalBoolean(body.isPrimary) ?? false
        : currentMedia.isPrimary;

    if (isPrimary) {
      await this.clearPrimaryForSection(eventId, organizationId, sectionKey);
    }

    const metadataJson = JSON.stringify(metadata);

    const rows = await this.prisma.$queryRaw<EventSectionMediaRow[]>`
      UPDATE "EventSectionMedia"
      SET
        "sectionKey" = ${sectionKey},
        "mediaRole" = ${mediaRole},
        "imageUrl" = ${imageUrl},
        "title" = ${title},
        "description" = ${description},
        "linkUrl" = ${linkUrl},
        "buttonLabel" = ${buttonLabel},
        "metadata" = CAST(${metadataJson} AS jsonb),
        "displayOrder" = ${displayOrder},
        "isActive" = ${isActive},
        "isPrimary" = ${isPrimary},
        "updatedAt" = NOW()
      WHERE "id" = ${mediaId}
        AND "eventId" = ${eventId}
        AND "organizationId" = ${organizationId}
      RETURNING *
    `;

    const media = rows[0];

    if (!media) {
      throw new NotFoundException('Imagem da seção não encontrada.');
    }

    await this.syncEventVisualFields(eventId, sectionKey, imageUrl, isPrimary);

    return {
      message: 'Imagem da seção atualizada com sucesso.',
      media: this.mapMedia(media),
    };
  }

  async reorder(eventId: string, body: any, organizationId: string) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    const items = Array.isArray(body?.items) ? body.items : [];

    if (items.length === 0) {
      throw new BadRequestException('Informe a lista de itens para reordenar.');
    }

    for (const item of items) {
      const id = this.normalizeRequiredString(item?.id, 'id da imagem');
      const displayOrder = this.normalizeOptionalNumber(item?.displayOrder);

      if (displayOrder === undefined) {
        throw new BadRequestException('displayOrder é obrigatório.');
      }

      await this.prisma.$executeRaw`
        UPDATE "EventSectionMedia"
        SET "displayOrder" = ${displayOrder},
            "updatedAt" = NOW()
        WHERE "id" = ${id}
          AND "eventId" = ${eventId}
          AND "organizationId" = ${organizationId}
      `;
    }

    return this.listByEvent(eventId, organizationId);
  }

  async remove(eventId: string, mediaId: string, organizationId: string) {
    const media = await this.findMediaByIdEventAndOrg(
      mediaId,
      eventId,
      organizationId,
    );

    await this.prisma.$executeRaw`
      DELETE FROM "EventSectionMedia"
      WHERE "id" = ${media.id}
        AND "eventId" = ${eventId}
        AND "organizationId" = ${organizationId}
    `;

    return {
      message: 'Imagem removida com sucesso.',
      removedMediaId: media.id,
    };
  }
}
