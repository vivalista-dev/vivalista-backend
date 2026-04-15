import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export enum GiftType {
  PHYSICAL = 'PHYSICAL',
  CASH = 'CASH',
  QUOTA = 'QUOTA',
  FREE_CONTRIBUTION = 'FREE_CONTRIBUTION',
}

export enum PriceMode {
  FIXED = 'FIXED',
  FLEXIBLE = 'FLEXIBLE',
}

export enum GiftStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  PURCHASED = 'PURCHASED',
  PARTIALLY_FUNDED = 'PARTIALLY_FUNDED',
  DISABLED = 'DISABLED',
}

export class CreateGiftDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number | null;

  @IsOptional()
  @IsUrl({}, { message: 'imageUrl deve ser uma URL válida.' })
  imageUrl?: string | null;

  @IsOptional()
  @IsUrl({}, { message: 'purchaseUrl deve ser uma URL válida.' })
  purchaseUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(GiftType)
  giftType?: GiftType;

  @IsOptional()
  @IsEnum(PriceMode)
  priceMode?: PriceMode;

  @IsOptional()
  @IsEnum(GiftStatus)
  giftStatus?: GiftStatus;

  @IsOptional()
  @IsBoolean()
  allowCustomAmount?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quotaTotal?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number | null;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number | null;

  @IsOptional()
  @IsString()
  category?: string | null;
}