
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GiftStatus, GiftType, PriceMode } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

type GuestStatus = 'INVITED' | 'CONFIRMED' | 'DECLINED';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

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
    return Boolean(value);
  }

  private normalizeOptionalNumber(value: any): number | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new BadRequestException('Valor numérico inválido.');
    }

    return parsed;
  }

  private normalizeRequiredDate(value: any, fieldLabel: string): Date {
    if (!value) {
      throw new BadRequestException(`${fieldLabel} é obrigatório.`);
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`${fieldLabel} inválido.`);
    }

    return parsed;
  }

  private normalizeOptionalDate(value: any): Date | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('Data inválida.');
    }

    return parsed;
  }

  private normalizeGiftType(value: any): GiftType | undefined {
    if (value === undefined) return undefined;

    const validValues = Object.values(GiftType);
    if (!validValues.includes(value)) {
      throw new BadRequestException('giftType inválido.');
    }

    return value as GiftType;
  }

  private normalizePriceMode(value: any): PriceMode | undefined {
    if (value === undefined) return undefined;

    const validValues = Object.values(PriceMode);
    if (!validValues.includes(value)) {
      throw new BadRequestException('priceMode inválido.');
    }

    return value as PriceMode;
  }

  private normalizeGiftStatus(value: any): GiftStatus | undefined {
    if (value === undefined) return undefined;

    const validValues = Object.values(GiftStatus);
    if (!validValues.includes(value)) {
      throw new BadRequestException('giftStatus inválido.');
    }

    return value as GiftStatus;
  }

  private normalizeGuestStatus(value: any): GuestStatus | undefined {
    if (value === undefined) return undefined;

    const normalized = String(value).trim().toUpperCase();

    if (
      normalized !== 'INVITED' &&
      normalized !== 'CONFIRMED' &&
      normalized !== 'DECLINED'
    ) {
      throw new BadRequestException(
        'status inválido. Use INVITED, CONFIRMED ou DECLINED.',
      );
    }

    return normalized as GuestStatus;
  }

  private async generateUniqueSlug(
    name: string,
    ignoreEventId?: string,
  ): Promise<string> {
    const baseSlug = this.slugify(name);

    if (!baseSlug) {
      throw new BadRequestException('Não foi possível gerar slug válido.');
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingEvent = await this.prisma.event.findFirst({
        where: {
          slug,
          ...(ignoreEventId
            ? {
                id: {
                  not: ignoreEventId,
                },
              }
            : {}),
        },
        select: { id: true },
      });

      if (!existingEvent) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  private async generateUniqueRsvpCode(): Promise<string> {
    while (true) {
      const code = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();

      const existingGuest = await this.prisma.guest.findFirst({
        where: { rsvpCode: code },
        select: { id: true },
      });

      if (!existingGuest) {
        return code;
      }
    }
  }

  private async findEventByIdAndOrg(id: string, organizationId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    return event;
  }

  private async findPublicEventEntityBySlug(slug: string) {
    const event = await this.prisma.event.findFirst({
      where: { slug },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    if (event.status !== 'PUBLISHED') {
      throw new NotFoundException('Evento não publicado.');
    }

    return event;
  }

  private async findGuestByEventAndCode(eventId: string, code: string) {
    const normalizedCode = this.normalizeRequiredString(
      code,
      'Código RSVP',
    ).toUpperCase();

    const guest = await this.prisma.guest.findFirst({
      where: {
        eventId,
        rsvpCode: normalizedCode,
      },
    });

    if (!guest) {
      throw new NotFoundException('Convidado não encontrado.');
    }

    return guest;
  }

  private async findGiftByIdAndEvent(eventId: string, giftId: string) {
    const gift = await this.prisma.gift.findFirst({
      where: {
        id: giftId,
        eventId,
      },
    });

    if (!gift) {
      throw new NotFoundException('Presente não encontrado.');
    }

    return gift;
  }

  private async findGiftByIdEventAndOrg(
    giftId: string,
    eventId: string,
    organizationId: string,
  ) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    const gift = await this.prisma.gift.findFirst({
      where: {
        id: giftId,
        eventId,
        organizationId,
      },
    });

    if (!gift) {
      throw new NotFoundException('Presente não encontrado.');
    }

    return gift;
  }

  private validateGiftRules(data: {
    giftType: GiftType;
    priceMode: PriceMode;
    price?: number | null;
    quotaTotal?: number | null;
    minAmount?: number | null;
    maxAmount?: number | null;
  }) {
    if (data.giftType === GiftType.QUOTA) {
      if (!data.quotaTotal || data.quotaTotal <= 0) {
        throw new BadRequestException(
          'Para presente por cotas, quotaTotal deve ser maior que zero.',
        );
      }
    }

    if (
      data.giftType !== GiftType.FREE_CONTRIBUTION &&
      data.priceMode === PriceMode.FIXED
    ) {
      if (data.price === null || data.price === undefined || data.price <= 0) {
        throw new BadRequestException(
          'Para preço fixo, informe um price maior que zero.',
        );
      }
    }

    if (
      data.minAmount !== null &&
      data.minAmount !== undefined &&
      data.maxAmount !== null &&
      data.maxAmount !== undefined &&
      data.minAmount > data.maxAmount
    ) {
      throw new BadRequestException(
        'minAmount não pode ser maior que maxAmount.',
      );
    }
  }

  private mapPublicEvent(event: any) {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
      status: event.status,
      slug: event.slug,
      coverImage: event.coverImage,
      eventType: event.eventType,
      giftMode: event.giftMode,
      templateKey: event.templateKey,
      themeKey: event.themeKey,
      openingMessage: event.openingMessage,
      pixEnabled: event.pixEnabled,
      freeContributionEnabled: event.freeContributionEnabled,
      quotaEnabled: event.quotaEnabled,
      contributionsFeedEnabled: event.contributionsFeedEnabled,
      publicTitle: event.publicTitle,
      publicSubtitle: event.publicSubtitle,
      heroImageUrl: event.heroImageUrl,
      welcomeMessage: event.welcomeMessage,
      primaryColor: event.primaryColor,
      secondaryColor: event.secondaryColor,
      fontStyle: event.fontStyle,
      heroLayout: event.heroLayout,
      showCountdown: event.showCountdown,
      showStory: event.showStory,
      showGallery: event.showGallery,
      showLocation: event.showLocation,
      showGifts: event.showGifts,
      showRsvp: event.showRsvp,
    };
  }

  private mapPublicEventBase(event: any) {
    return {
      id: event.id,
      name: event.name,
      slug: event.slug,
    };
  }

  private buildPublicRsvpConfig() {
    return {
      enabled: true,
      lookupMode: 'CODE',
    };
  }

  private mapGiftResponse(gift: any) {
    return {
      id: gift.id,
      title: gift.title,
      description: gift.description,
      price: gift.price,
      imageUrl: gift.imageUrl,
      purchaseUrl: gift.purchaseUrl,
      isReserved: gift.isReserved,
      isPurchased: gift.isPurchased,
      reservedByName: gift.reservedByName,
      reservedAt: gift.reservedAt,
      purchasedByName: gift.purchasedByName,
      purchasedAt: gift.purchasedAt,
      giftType: gift.giftType,
      giftStatus: gift.giftStatus,
    };
  }

  private mapGuestResponse(guest: any) {
    return {
      id: guest.id,
      name: guest.name,
      status: guest.status,
      rsvpCode: guest.rsvpCode,
    };
  }

  private async buildPublicStats(eventId: string) {
    const totalGuests = await this.prisma.guest.count({
      where: { eventId },
    });

    const confirmedGuests = await this.prisma.guest.count({
      where: {
        eventId,
        status: 'CONFIRMED',
      },
    });

    const declinedGuests = await this.prisma.guest.count({
      where: {
        eventId,
        status: 'DECLINED',
      },
    });

    const pendingGuests = await this.prisma.guest.count({
      where: {
        eventId,
        status: 'INVITED',
      },
    });

    return {
      totalGuests,
      confirmedGuests,
      pendingGuests,
      declinedGuests,
    };
  }

  private async buildPublicGifts(eventId: string) {
    const gifts = await this.prisma.gift.findMany({
      where: {
        eventId,
        isActive: true,
      },
      include: {
        quotas: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return gifts.map((gift) => {
      const quotaTotal = gift.quotaTotal ?? 0;
      const quotaSold = gift.quotaSold ?? 0;
      const quotaRemaining =
        quotaTotal > 0 ? Math.max(quotaTotal - quotaSold, 0) : 0;
      const progress =
        quotaTotal > 0
          ? Math.min(Math.round((quotaSold / quotaTotal) * 100), 100)
          : 0;

      return {
        id: gift.id,
        title: gift.title,
        description: gift.description,
        price: gift.price,
        imageUrl: gift.imageUrl,
        purchaseUrl: gift.purchaseUrl,
        isReserved: gift.isReserved,
        isPurchased: gift.isPurchased,
        reservedByName: gift.isReserved ? gift.reservedByName : null,
        reservedAt: gift.isReserved ? gift.reservedAt : null,
        purchasedByName: gift.isPurchased ? gift.purchasedByName : null,
        purchasedAt: gift.isPurchased ? gift.purchasedAt : null,
        giftType: gift.giftType,
        priceMode: gift.priceMode,
        giftStatus: gift.giftStatus,
        allowCustomAmount: gift.allowCustomAmount,
        minAmount: gift.minAmount,
        maxAmount: gift.maxAmount,
        category: gift.category,
        isFeatured: gift.isFeatured,
        displayOrder: gift.displayOrder,
        quotaTotal,
        quotaSold,
        quotaRemaining,
        progress,
        quotas: gift.quotas.map((quota) => ({
          id: quota.id,
          label: quota.label,
          amount: quota.amount,
          isPaid: quota.isPaid,
          contributionId: quota.contributionId,
        })),
        ui: {
          canReserve:
            gift.giftType === GiftType.PHYSICAL &&
            !gift.isReserved &&
            !gift.isPurchased,
          canPurchase:
            gift.giftType === GiftType.PHYSICAL &&
            gift.giftStatus !== GiftStatus.DISABLED &&
            !gift.isPurchased,
          canContribute:
            gift.giftType === GiftType.CASH ||
            gift.giftType === GiftType.QUOTA ||
            gift.giftType === GiftType.FREE_CONTRIBUTION,
          acceptsCustomAmount:
            gift.priceMode === PriceMode.FLEXIBLE ||
            gift.allowCustomAmount === true,
        },
      };
    });
  }

  private async buildPublicContributions(eventId: string) {
    const contributions = await this.prisma.contribution.findMany({
      where: {
        eventId,
        isPublic: true,
        status: 'PAID',
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        gift: {
          select: {
            id: true,
            title: true,
            giftType: true,
          },
        },
      },
    });

    return contributions.map((contribution) => ({
      id: contribution.id,
      contributorName: contribution.contributorName,
      message: contribution.message,
      amount: contribution.amount,
      paymentMethod: contribution.paymentMethod,
      paidAt: contribution.paidAt,
      createdAt: contribution.createdAt,
      gift: contribution.gift
        ? {
            id: contribution.gift.id,
            title: contribution.gift.title,
            giftType: contribution.gift.giftType,
          }
        : null,
    }));
  }

  private async buildPublicFinancialSummary(eventId: string) {
    const paidContributions = await this.prisma.contribution.findMany({
      where: {
        eventId,
        status: 'PAID',
      },
      select: {
        amount: true,
      },
    });

    const pendingCount = await this.prisma.contribution.count({
      where: {
        eventId,
        status: 'PENDING',
      },
    });

    const paidCount = paidContributions.length;
    const totalRaised = paidContributions.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const averageContribution = paidCount > 0 ? totalRaised / paidCount : 0;

    return {
      totalRaised,
      paidContributionsCount: paidCount,
      pendingContributionsCount: pendingCount,
      averageContribution,
    };
  }

  async create(data: any, organizationId: string) {
    const name = this.normalizeRequiredString(data?.name, 'Nome do evento');
    const date = this.normalizeRequiredDate(data?.date, 'Data do evento');
    const location = this.normalizeRequiredString(
      data?.location,
      'Local do evento',
    );
    const slug = await this.generateUniqueSlug(name);

    return this.prisma.event.create({
      data: {
        name,
        slug,
        organizationId,
        description: this.normalizeOptionalString(data?.description),
        location,
        capacity:
          this.normalizeOptionalNumber(data?.capacity) === undefined
            ? null
            : this.normalizeOptionalNumber(data?.capacity),
        status: data?.status ?? 'DRAFT',
        date,
        coverImage: this.normalizeOptionalString(data?.coverImage),
        eventType: data?.eventType ?? undefined,
        giftMode: data?.giftMode ?? undefined,
        templateKey: this.normalizeOptionalString(data?.templateKey),
        themeKey: this.normalizeOptionalString(data?.themeKey),
        openingMessage: this.normalizeOptionalString(data?.openingMessage),
        pixEnabled: this.normalizeOptionalBoolean(data?.pixEnabled) ?? false,
        freeContributionEnabled:
          this.normalizeOptionalBoolean(data?.freeContributionEnabled) ?? false,
        quotaEnabled: this.normalizeOptionalBoolean(data?.quotaEnabled) ?? false,
        contributionsFeedEnabled:
          this.normalizeOptionalBoolean(data?.contributionsFeedEnabled) ?? false,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.event.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    return this.findEventByIdAndOrg(id, organizationId);
  }

  async update(id: string, data: any, organizationId: string) {
    const currentEvent = await this.findEventByIdAndOrg(id, organizationId);

    let slug = currentEvent.slug;

    if (data.slug !== undefined) {
      const incomingSlugSource = this.normalizeOptionalString(data.slug);

      if (incomingSlugSource) {
        slug = await this.generateUniqueSlug(
          incomingSlugSource,
          currentEvent.id,
        );
      } else if (data.name && data.name !== currentEvent.name) {
        slug = await this.generateUniqueSlug(data.name, currentEvent.id);
      }
    } else if (!slug) {
      slug = await this.generateUniqueSlug(
        data.name ?? currentEvent.name,
        currentEvent.id,
      );
    } else if (data.name && data.name !== currentEvent.name) {
      slug = await this.generateUniqueSlug(data.name, currentEvent.id);
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        name:
          data.name !== undefined
            ? this.normalizeRequiredString(data.name, 'Nome do evento')
            : undefined,
        slug,
        description:
          data.description !== undefined
            ? this.normalizeOptionalString(data.description)
            : undefined,
        location:
          data.location !== undefined
            ? this.normalizeRequiredString(data.location, 'Local do evento')
            : undefined,
        capacity:
          data.capacity !== undefined
            ? this.normalizeOptionalNumber(data.capacity)
            : undefined,
        status: data.status ?? undefined,
        date:
          data.date !== undefined
            ? this.normalizeRequiredDate(data.date, 'Data do evento')
            : undefined,
        coverImage:
          data.coverImage !== undefined
            ? this.normalizeOptionalString(data.coverImage)
            : undefined,
        eventType: data.eventType ?? undefined,
        giftMode: data.giftMode ?? undefined,
        templateKey:
          data.templateKey !== undefined
            ? this.normalizeOptionalString(data.templateKey)
            : undefined,
        themeKey:
          data.themeKey !== undefined
            ? this.normalizeOptionalString(data.themeKey)
            : undefined,
        openingMessage:
          data.openingMessage !== undefined
            ? this.normalizeOptionalString(data.openingMessage)
            : undefined,
        pixEnabled:
          data.pixEnabled !== undefined
            ? this.normalizeOptionalBoolean(data.pixEnabled)
            : undefined,
        freeContributionEnabled:
          data.freeContributionEnabled !== undefined
            ? this.normalizeOptionalBoolean(data.freeContributionEnabled)
            : undefined,
        quotaEnabled:
          data.quotaEnabled !== undefined
            ? this.normalizeOptionalBoolean(data.quotaEnabled)
            : undefined,
        contributionsFeedEnabled:
          data.contributionsFeedEnabled !== undefined
            ? this.normalizeOptionalBoolean(data.contributionsFeedEnabled)
            : undefined,
      },
    });
  }

  async updateCoverImage(
    id: string,
    coverImage: string,
    organizationId: string,
  ) {
    await this.findEventByIdAndOrg(id, organizationId);

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: {
        coverImage,
      },
    });

    return {
      message: 'Imagem de capa do evento atualizada com sucesso.',
      event: updatedEvent,
    };
  }

  async findVisualSettings(id: string, organizationId: string) {
    const event = await this.findEventByIdAndOrg(id, organizationId);

    return {
      eventId: event.id,
      visual: {
        publicTitle: event.publicTitle,
        publicSubtitle: event.publicSubtitle,
        heroImageUrl: event.heroImageUrl,
        welcomeMessage: event.welcomeMessage,
        primaryColor: event.primaryColor,
        secondaryColor: event.secondaryColor,
        fontStyle: event.fontStyle,
        heroLayout: event.heroLayout,
        showCountdown: event.showCountdown,
        showStory: event.showStory,
        showGallery: event.showGallery,
        showLocation: event.showLocation,
        showGifts: event.showGifts,
        showRsvp: event.showRsvp,
      },
    };
  }

  async updateVisualSettings(id: string, body: any, organizationId: string) {
    await this.findEventByIdAndOrg(id, organizationId);

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: {
        publicTitle: this.normalizeOptionalString(body.publicTitle),
        publicSubtitle: this.normalizeOptionalString(body.publicSubtitle),
        heroImageUrl: this.normalizeOptionalString(body.heroImageUrl),
        welcomeMessage: this.normalizeOptionalString(body.welcomeMessage),
        primaryColor: this.normalizeOptionalString(body.primaryColor),
        secondaryColor: this.normalizeOptionalString(body.secondaryColor),
        fontStyle: this.normalizeOptionalString(body.fontStyle),
        heroLayout: this.normalizeOptionalString(body.heroLayout),
        showCountdown: this.normalizeOptionalBoolean(body.showCountdown),
        showStory: this.normalizeOptionalBoolean(body.showStory),
        showGallery: this.normalizeOptionalBoolean(body.showGallery),
        showLocation: this.normalizeOptionalBoolean(body.showLocation),
        showGifts: this.normalizeOptionalBoolean(body.showGifts),
        showRsvp: this.normalizeOptionalBoolean(body.showRsvp),
      },
    });

    return {
      message: 'Configurações visuais atualizadas com sucesso.',
      eventId: updatedEvent.id,
      visual: {
        publicTitle: updatedEvent.publicTitle,
        publicSubtitle: updatedEvent.publicSubtitle,
        heroImageUrl: updatedEvent.heroImageUrl,
        welcomeMessage: updatedEvent.welcomeMessage,
        primaryColor: updatedEvent.primaryColor,
        secondaryColor: updatedEvent.secondaryColor,
        fontStyle: updatedEvent.fontStyle,
        heroLayout: updatedEvent.heroLayout,
        showCountdown: updatedEvent.showCountdown,
        showStory: updatedEvent.showStory,
        showGallery: updatedEvent.showGallery,
        showLocation: updatedEvent.showLocation,
        showGifts: updatedEvent.showGifts,
        showRsvp: updatedEvent.showRsvp,
      },
    };
  }

  async remove(id: string, organizationId: string) {
    await this.findEventByIdAndOrg(id, organizationId);

    return this.prisma.event.delete({
      where: { id },
    });
  }

  async findEventGiftDashboard(eventId: string, organizationId: string) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    const totalGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
      },
    });

    const activeGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
        isActive: true,
      },
    });

    const reservedGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
        isReserved: true,
      },
    });

    const purchasedGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
        isPurchased: true,
      },
    });

    const availableGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
        isActive: true,
        isReserved: false,
        isPurchased: false,
      },
    });

    return {
      eventId,
      dashboard: {
        totalGifts,
        activeGifts,
        reservedGifts,
        purchasedGifts,
        availableGifts,
      },
    };
  }

  async createGift(eventId: string, body: any, organizationId: string) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    const title = this.normalizeRequiredString(body?.title, 'Título do presente');
    const description = this.normalizeOptionalString(body?.description);
    const imageUrl = this.normalizeOptionalString(body?.imageUrl);
    const purchaseUrl = this.normalizeOptionalString(body?.purchaseUrl);
    const category = this.normalizeOptionalString(body?.category);

    const giftType = this.normalizeGiftType(body?.giftType) ?? GiftType.PHYSICAL;
    const priceMode = this.normalizePriceMode(body?.priceMode) ?? PriceMode.FIXED;
    const giftStatus =
      this.normalizeGiftStatus(body?.giftStatus) ?? GiftStatus.AVAILABLE;

    const price = this.normalizeOptionalNumber(body?.price);
    const quotaTotal = this.normalizeOptionalNumber(body?.quotaTotal);
    const quotaSold = (this.normalizeOptionalNumber(body?.quotaSold) ?? 0) as number;
    const minAmount = this.normalizeOptionalNumber(body?.minAmount);
    const maxAmount = this.normalizeOptionalNumber(body?.maxAmount);
    const displayOrder = this.normalizeOptionalNumber(body?.displayOrder) ?? 0;

    this.validateGiftRules({
      giftType,
      priceMode,
      price,
      quotaTotal,
      minAmount,
      maxAmount,
    });

    return this.prisma.gift.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        purchaseUrl,
        isActive: this.normalizeOptionalBoolean(body?.isActive) ?? true,
        eventId,
        organizationId,
        giftType,
        priceMode,
        giftStatus,
        allowCustomAmount:
          this.normalizeOptionalBoolean(body?.allowCustomAmount) ?? false,
        quotaTotal,
        quotaSold,
        minAmount,
        maxAmount,
        isFeatured: this.normalizeOptionalBoolean(body?.isFeatured) ?? false,
        displayOrder,
        category,
      },
    });
  }

  async findGiftsByEvent(eventId: string, organizationId: string) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    return this.prisma.gift.findMany({
      where: {
        eventId,
        organizationId,
      },
      include: {
        quotas: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async updateGift(eventId: string, giftId: string, body: any, organizationId: string) {
    const gift = await this.findGiftByIdEventAndOrg(
      giftId,
      eventId,
      organizationId,
    );

    const nextGiftType = this.normalizeGiftType(body?.giftType) ?? gift.giftType;
    const nextPriceMode = this.normalizePriceMode(body?.priceMode) ?? gift.priceMode;
    const nextPrice =
      body?.price !== undefined
        ? this.normalizeOptionalNumber(body.price)
        : gift.price;
    const nextQuotaTotal =
      body?.quotaTotal !== undefined
        ? this.normalizeOptionalNumber(body.quotaTotal)
        : gift.quotaTotal;
    const nextMinAmount =
      body?.minAmount !== undefined
        ? this.normalizeOptionalNumber(body.minAmount)
        : gift.minAmount;
    const nextMaxAmount =
      body?.maxAmount !== undefined
        ? this.normalizeOptionalNumber(body.maxAmount)
        : gift.maxAmount;

    this.validateGiftRules({
      giftType: nextGiftType,
      priceMode: nextPriceMode,
      price: nextPrice,
      quotaTotal: nextQuotaTotal,
      minAmount: nextMinAmount,
      maxAmount: nextMaxAmount,
    });

    if (
      nextQuotaTotal !== null &&
      nextQuotaTotal !== undefined &&
      nextQuotaTotal < (gift.quotaSold ?? 0)
    ) {
      throw new BadRequestException(
        'quotaTotal não pode ser menor que quotaSold.',
      );
    }

    const isReserved =
      body?.isReserved !== undefined
        ? this.normalizeOptionalBoolean(body.isReserved)
        : undefined;

    const isPurchased =
      body?.isPurchased !== undefined
        ? this.normalizeOptionalBoolean(body.isPurchased)
        : undefined;

    return this.prisma.gift.update({
      where: { id: gift.id },
      data: {
        title:
          body?.title !== undefined
            ? this.normalizeRequiredString(body.title, 'Título do presente')
            : undefined,
        description:
          body?.description !== undefined
            ? this.normalizeOptionalString(body.description)
            : undefined,
        price: body?.price !== undefined ? nextPrice : undefined,
        imageUrl:
          body?.imageUrl !== undefined
            ? this.normalizeOptionalString(body.imageUrl)
            : undefined,
        purchaseUrl:
          body?.purchaseUrl !== undefined
            ? this.normalizeOptionalString(body.purchaseUrl)
            : undefined,
        isActive:
          body?.isActive !== undefined
            ? this.normalizeOptionalBoolean(body.isActive)
            : undefined,
        isReserved,
        isPurchased,
        reservedByName:
          body?.reservedByName !== undefined
            ? this.normalizeOptionalString(body.reservedByName)
            : isReserved === false
              ? null
              : undefined,
        reservedAt:
          body?.reservedAt !== undefined
            ? this.normalizeOptionalDate(body.reservedAt)
            : isReserved === false
              ? null
              : undefined,
        purchasedByName:
          body?.purchasedByName !== undefined
            ? this.normalizeOptionalString(body.purchasedByName)
            : isPurchased === false
              ? null
              : undefined,
        purchasedAt:
          body?.purchasedAt !== undefined
            ? this.normalizeOptionalDate(body.purchasedAt)
            : isPurchased === false
              ? null
              : undefined,
        giftType: body?.giftType !== undefined ? nextGiftType : undefined,
        priceMode: body?.priceMode !== undefined ? nextPriceMode : undefined,
        giftStatus:
          body?.giftStatus !== undefined
            ? this.normalizeGiftStatus(body.giftStatus)
            : undefined,
        allowCustomAmount:
          body?.allowCustomAmount !== undefined
            ? this.normalizeOptionalBoolean(body.allowCustomAmount)
            : undefined,
        quotaTotal:
          body?.quotaTotal !== undefined ? nextQuotaTotal : undefined,
        quotaSold:
          body?.quotaSold !== undefined
            ? (this.normalizeOptionalNumber(body.quotaSold) ?? 0)
            : undefined,
        minAmount:
          body?.minAmount !== undefined ? nextMinAmount : undefined,
        maxAmount:
          body?.maxAmount !== undefined ? nextMaxAmount : undefined,
        isFeatured:
          body?.isFeatured !== undefined
            ? this.normalizeOptionalBoolean(body.isFeatured)
            : undefined,
        displayOrder:
          body?.displayOrder !== undefined
            ? this.normalizeOptionalNumber(body.displayOrder) ?? 0
            : undefined,
        category:
          body?.category !== undefined
            ? this.normalizeOptionalString(body.category)
            : undefined,
      },
    });
  }

  async updateGiftImage(
    eventId: string,
    giftId: string,
    imageUrl: string,
    organizationId: string,
  ) {
    const gift = await this.findGiftByIdEventAndOrg(
      giftId,
      eventId,
      organizationId,
    );

    const updatedGift = await this.prisma.gift.update({
      where: { id: gift.id },
      data: {
        imageUrl,
      },
    });

    return {
      message: 'Imagem do presente atualizada com sucesso.',
      gift: updatedGift,
    };
  }

  async removeGift(eventId: string, giftId: string, organizationId: string) {
    const gift = await this.findGiftByIdEventAndOrg(
      giftId,
      eventId,
      organizationId,
    );

    return this.prisma.gift.delete({
      where: { id: gift.id },
    });
  }

  async createGuest(eventId: string, body: any, organizationId: string) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    const name = this.normalizeRequiredString(body?.name, 'Nome do convidado');
    const email = this.normalizeOptionalString(body?.email);
    const phone = this.normalizeOptionalString(body?.phone);
    const status = this.normalizeGuestStatus(body?.status) ?? 'INVITED';
    const rsvpCode = await this.generateUniqueRsvpCode();

    return this.prisma.guest.create({
      data: {
        name,
        email,
        phone,
        eventId,
        organizationId,
        status,
        rsvpCode,
      },
    });
  }

  async findGuestsByEvent(eventId: string, organizationId: string) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    return this.prisma.guest.findMany({
      where: {
        eventId,
        organizationId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findEventGuestDashboard(eventId: string, organizationId: string) {
    await this.findEventByIdAndOrg(eventId, organizationId);

    const totalGuests = await this.prisma.guest.count({
      where: {
        eventId,
        organizationId,
      },
    });

    const confirmedGuests = await this.prisma.guest.count({
      where: {
        eventId,
        organizationId,
        status: 'CONFIRMED',
      },
    });

    const declinedGuests = await this.prisma.guest.count({
      where: {
        eventId,
        organizationId,
        status: 'DECLINED',
      },
    });

    const invitedGuests = await this.prisma.guest.count({
      where: {
        eventId,
        organizationId,
        status: 'INVITED',
      },
    });

    return {
      eventId,
      dashboard: {
        totalGuests,
        confirmedGuests,
        invitedGuests,
        declinedGuests,
      },
    };
  }

  async findPublicBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug);

    return {
      event: this.mapPublicEvent(event),
      rsvp: this.buildPublicRsvpConfig(),
    };
  }

  async findPublicStatsBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const stats = await this.buildPublicStats(event.id);

    return {
      event: {
        ...this.mapPublicEventBase(event),
        status: event.status,
        coverImage: event.coverImage,
      },
      stats,
    };
  }

  async findPublicFinancialSummaryBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const financial = await this.buildPublicFinancialSummary(event.id);

    return {
      event: this.mapPublicEventBase(event),
      financial,
    };
  }

  async findPublicFullBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const stats = await this.buildPublicStats(event.id);
    const gifts = await this.buildPublicGifts(event.id);
    const contributions = await this.buildPublicContributions(event.id);
    const financial = await this.buildPublicFinancialSummary(event.id);

    return {
      event: this.mapPublicEvent(event),
      rsvp: this.buildPublicRsvpConfig(),
      stats,
      gifts,
      contributions,
      financial,
    };
  }

  async lookupGuestByCode(slug: string, code: string) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const guest = await this.findGuestByEventAndCode(event.id, code);

    return {
      event: this.mapPublicEventBase(event),
      guest: this.mapGuestResponse(guest),
    };
  }

  async confirmGuestRsvp(slug: string, code: string) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const guest = await this.findGuestByEventAndCode(event.id, code);

    const updatedGuest = await this.prisma.guest.update({
      where: { id: guest.id },
      data: {
        status: 'CONFIRMED',
      },
    });

    return {
      message: 'Presença confirmada com sucesso.',
      event: this.mapPublicEventBase(event),
      guest: this.mapGuestResponse(updatedGuest),
    };
  }

  async declineGuestRsvp(slug: string, code: string) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const guest = await this.findGuestByEventAndCode(event.id, code);

    const updatedGuest = await this.prisma.guest.update({
      where: { id: guest.id },
      data: {
        status: 'DECLINED',
      },
    });

    return {
      message: 'Presença recusada com sucesso.',
      event: this.mapPublicEventBase(event),
      guest: this.mapGuestResponse(updatedGuest),
    };
  }

  async findPublicGiftsBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const gifts = await this.buildPublicGifts(event.id);

    return {
      event: {
        ...this.mapPublicEventBase(event),
        giftMode: event.giftMode,
        pixEnabled: event.pixEnabled,
        freeContributionEnabled: event.freeContributionEnabled,
        quotaEnabled: event.quotaEnabled,
      },
      gifts,
    };
  }

  async findPublicContributionsBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const contributions = await this.buildPublicContributions(event.id);

    return {
      event: this.mapPublicEventBase(event),
      contributions,
    };
  }

  async reserveGiftBySlug(
    slug: string,
    giftId: string,
    body: { reservedByName: string },
  ) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const gift = await this.findGiftByIdAndEvent(event.id, giftId);

    if (!gift.isActive) {
      throw new BadRequestException('Presente inativo.');
    }

    if (gift.giftType !== GiftType.PHYSICAL) {
      throw new BadRequestException(
        'Apenas presentes físicos podem ser reservados.',
      );
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Presente já comprado.');
    }

    if (gift.isReserved) {
      throw new BadRequestException('Presente já reservado.');
    }

    const reservedByName = this.normalizeRequiredString(
      body?.reservedByName,
      'Nome de quem vai reservar',
    );

    const updatedGift = await this.prisma.gift.update({
      where: { id: gift.id },
      data: {
        isReserved: true,
        giftStatus: GiftStatus.RESERVED,
        reservedByName,
        reservedAt: new Date(),
      },
    });

    return {
      message: 'Presente reservado com sucesso.',
      event: this.mapPublicEventBase(event),
      gift: this.mapGiftResponse(updatedGift),
    };
  }

  async unreserveGiftBySlug(slug: string, giftId: string) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const gift = await this.findGiftByIdAndEvent(event.id, giftId);

    if (!gift.isReserved) {
      throw new BadRequestException('Presente não está reservado.');
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Presente já comprado.');
    }

    const updatedGift = await this.prisma.gift.update({
      where: { id: gift.id },
      data: {
        isReserved: false,
        giftStatus: GiftStatus.AVAILABLE,
        reservedByName: null,
        reservedAt: null,
      },
    });

    return {
      message: 'Reserva cancelada com sucesso.',
      event: this.mapPublicEventBase(event),
      gift: this.mapGiftResponse(updatedGift),
    };
  }

  async purchaseGiftBySlug(
    slug: string,
    giftId: string,
    body: { purchasedByName: string },
  ) {
    const event = await this.findPublicEventEntityBySlug(slug);
    const gift = await this.findGiftByIdAndEvent(event.id, giftId);

    if (!gift.isActive) {
      throw new BadRequestException('Presente inativo.');
    }

    if (gift.giftType !== GiftType.PHYSICAL) {
      throw new BadRequestException(
        'A compra direta nesta rota é apenas para presentes físicos.',
      );
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Presente já comprado.');
    }

    const purchasedByName = this.normalizeRequiredString(
      body?.purchasedByName,
      'Nome de quem comprou',
    );

    const updatedGift = await this.prisma.gift.update({
      where: { id: gift.id },
      data: {
        isPurchased: true,
        giftStatus: GiftStatus.PURCHASED,
        purchasedByName,
        purchasedAt: new Date(),
        isReserved: true,
        reservedByName: gift.reservedByName ?? purchasedByName,
        reservedAt: gift.reservedAt ?? new Date(),
      },
    });

    return {
      message: 'Presente marcado como comprado com sucesso.',
      event: this.mapPublicEventBase(event),
      gift: this.mapGiftResponse(updatedGift),
    };
  }
}
