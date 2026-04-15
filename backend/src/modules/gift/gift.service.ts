import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGiftDto,
  GiftStatus,
  GiftType,
  PriceMode,
} from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

type NormalizedGiftRulesInput = {
  giftType: GiftType;
  priceMode: PriceMode;
  price?: number | null;
  quotaTotal?: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
};

@Injectable()
export class GiftService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeOptionalString(value: unknown): string | null | undefined {
    if (value === undefined) return undefined;
    if (value === null) return null;

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : null;
  }

  private normalizeRequiredString(value: unknown, fieldLabel: string): string {
    const normalized = this.normalizeOptionalString(value);

    if (!normalized) {
      throw new BadRequestException(`${fieldLabel} é obrigatório.`);
    }

    return normalized;
  }

  private normalizeOptionalNumber(value: unknown): number | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new BadRequestException('Valor numérico inválido.');
    }

    return parsed;
  }

  private normalizeOptionalBoolean(value: unknown): boolean | undefined {
    if (value === undefined) return undefined;
    return Boolean(value);
  }

  private normalizeGiftType(value: unknown): GiftType | undefined {
    if (value === undefined) return undefined;

    const validValues = Object.values(GiftType);
    if (!validValues.includes(value as GiftType)) {
      throw new BadRequestException('giftType inválido.');
    }

    return value as GiftType;
  }

  private normalizePriceMode(value: unknown): PriceMode | undefined {
    if (value === undefined) return undefined;

    const validValues = Object.values(PriceMode);
    if (!validValues.includes(value as PriceMode)) {
      throw new BadRequestException('priceMode inválido.');
    }

    return value as PriceMode;
  }

  private normalizeGiftStatus(value: unknown): GiftStatus | undefined {
    if (value === undefined) return undefined;

    const validValues = Object.values(GiftStatus);
    if (!validValues.includes(value as GiftStatus)) {
      throw new BadRequestException('giftStatus inválido.');
    }

    return value as GiftStatus;
  }

  private async ensureEventExists(eventId: string, organizationId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId,
      },
      select: {
        id: true,
        organizationId: true,
        name: true,
        slug: true,
        status: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    return event;
  }

  private async ensureGiftExists(
    eventId: string,
    giftId: string,
    organizationId: string,
  ) {
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

  private validateGiftRules(data: NormalizedGiftRulesInput) {
    if (data.giftType === GiftType.QUOTA) {
      if (!data.quotaTotal || data.quotaTotal <= 0) {
        throw new BadRequestException(
          'Para presente por cotas, informe quotaTotal maior que zero.',
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
      data.giftType === GiftType.FREE_CONTRIBUTION &&
      data.priceMode === PriceMode.FIXED &&
      data.price !== null &&
      data.price !== undefined &&
      data.price <= 0
    ) {
      throw new BadRequestException(
        'Quando informado, o price da contribuição livre deve ser maior que zero.',
      );
    }

    if (
      data.minAmount !== null &&
      data.minAmount !== undefined &&
      data.minAmount <= 0
    ) {
      throw new BadRequestException(
        'minAmount deve ser maior que zero quando informado.',
      );
    }

    if (
      data.maxAmount !== null &&
      data.maxAmount !== undefined &&
      data.maxAmount <= 0
    ) {
      throw new BadRequestException(
        'maxAmount deve ser maior que zero quando informado.',
      );
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

  private buildCreateData(
    eventId: string,
    organizationId: string,
    dto: CreateGiftDto,
  ) {
    const title = this.normalizeRequiredString(dto.title, 'Título do presente');
    const description = this.normalizeOptionalString(dto.description);
    const imageUrl = this.normalizeOptionalString(dto.imageUrl);
    const purchaseUrl = this.normalizeOptionalString(dto.purchaseUrl);
    const category = this.normalizeOptionalString(dto.category);

    const giftType = this.normalizeGiftType(dto.giftType) ?? GiftType.PHYSICAL;
    const priceMode = this.normalizePriceMode(dto.priceMode) ?? PriceMode.FIXED;
    const giftStatus =
      this.normalizeGiftStatus(dto.giftStatus) ?? GiftStatus.AVAILABLE;

    const price = this.normalizeOptionalNumber(dto.price);
    const quotaTotal = this.normalizeOptionalNumber(dto.quotaTotal);
    const minAmount = this.normalizeOptionalNumber(dto.minAmount);
    const maxAmount = this.normalizeOptionalNumber(dto.maxAmount);
    const displayOrder = this.normalizeOptionalNumber(dto.displayOrder) ?? 0;

    this.validateGiftRules({
      giftType,
      priceMode,
      price,
      quotaTotal,
      minAmount,
      maxAmount,
    });

    return {
      title,
      description,
      price,
      imageUrl,
      purchaseUrl,
      isActive: this.normalizeOptionalBoolean(dto.isActive) ?? true,
      eventId,
      organizationId,
      giftType,
      priceMode,
      giftStatus,
      allowCustomAmount:
        this.normalizeOptionalBoolean(dto.allowCustomAmount) ?? false,
      quotaTotal,
      minAmount,
      maxAmount,
      isFeatured: this.normalizeOptionalBoolean(dto.isFeatured) ?? false,
      displayOrder,
      category,
    };
  }

  async create(
    eventId: string,
    organizationId: string,
    dto: CreateGiftDto,
  ) {
    await this.ensureEventExists(eventId, organizationId);

    return this.prisma.gift.create({
      data: this.buildCreateData(eventId, organizationId, dto),
    });
  }

  async findAllByEvent(eventId: string, organizationId: string) {
    await this.ensureEventExists(eventId, organizationId);

    return this.prisma.gift.findMany({
      where: {
        eventId,
        organizationId,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(eventId: string, giftId: string, organizationId: string) {
    await this.ensureEventExists(eventId, organizationId);
    return this.ensureGiftExists(eventId, giftId, organizationId);
  }

  async update(
    eventId: string,
    giftId: string,
    organizationId: string,
    dto: UpdateGiftDto,
  ) {
    await this.ensureEventExists(eventId, organizationId);

    const existingGift = await this.ensureGiftExists(
      eventId,
      giftId,
      organizationId,
    );

    const nextGiftType =
      this.normalizeGiftType(dto.giftType) ??
      (existingGift.giftType as GiftType);

    const nextPriceMode =
      this.normalizePriceMode(dto.priceMode) ??
      (existingGift.priceMode as PriceMode);

    const nextPrice =
      dto.price !== undefined
        ? this.normalizeOptionalNumber(dto.price)
        : existingGift.price;

    const nextQuotaTotal =
      dto.quotaTotal !== undefined
        ? this.normalizeOptionalNumber(dto.quotaTotal)
        : existingGift.quotaTotal;

    const nextMinAmount =
      dto.minAmount !== undefined
        ? this.normalizeOptionalNumber(dto.minAmount)
        : existingGift.minAmount;

    const nextMaxAmount =
      dto.maxAmount !== undefined
        ? this.normalizeOptionalNumber(dto.maxAmount)
        : existingGift.maxAmount;

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
      nextQuotaTotal < (existingGift.quotaSold ?? 0)
    ) {
      throw new BadRequestException(
        'quotaTotal não pode ser menor que quotaSold.',
      );
    }

    return this.prisma.gift.update({
      where: {
        id: existingGift.id,
      },
      data: {
        title:
          dto.title !== undefined
            ? this.normalizeRequiredString(dto.title, 'Título do presente')
            : undefined,
        description:
          dto.description !== undefined
            ? this.normalizeOptionalString(dto.description)
            : undefined,
        price: dto.price !== undefined ? nextPrice : undefined,
        imageUrl:
          dto.imageUrl !== undefined
            ? this.normalizeOptionalString(dto.imageUrl)
            : undefined,
        purchaseUrl:
          dto.purchaseUrl !== undefined
            ? this.normalizeOptionalString(dto.purchaseUrl)
            : undefined,
        isActive:
          dto.isActive !== undefined
            ? this.normalizeOptionalBoolean(dto.isActive)
            : undefined,
        giftType: dto.giftType !== undefined ? nextGiftType : undefined,
        priceMode: dto.priceMode !== undefined ? nextPriceMode : undefined,
        giftStatus:
          dto.giftStatus !== undefined
            ? this.normalizeGiftStatus(dto.giftStatus)
            : undefined,
        allowCustomAmount:
          dto.allowCustomAmount !== undefined
            ? this.normalizeOptionalBoolean(dto.allowCustomAmount)
            : undefined,
        quotaTotal:
          dto.quotaTotal !== undefined ? nextQuotaTotal : undefined,
        minAmount:
          dto.minAmount !== undefined ? nextMinAmount : undefined,
        maxAmount:
          dto.maxAmount !== undefined ? nextMaxAmount : undefined,
        isFeatured:
          dto.isFeatured !== undefined
            ? this.normalizeOptionalBoolean(dto.isFeatured)
            : undefined,
        displayOrder:
          dto.displayOrder !== undefined
            ? this.normalizeOptionalNumber(dto.displayOrder) ?? 0
            : undefined,
        category:
          dto.category !== undefined
            ? this.normalizeOptionalString(dto.category)
            : undefined,
      },
    });
  }

  async remove(eventId: string, giftId: string, organizationId: string) {
    await this.ensureEventExists(eventId, organizationId);

    const existingGift = await this.ensureGiftExists(
      eventId,
      giftId,
      organizationId,
    );

    return this.prisma.gift.delete({
      where: {
        id: existingGift.id,
      },
    });
  }
}