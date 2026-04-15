import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export enum UpdateGiftType {
  PHYSICAL = 'PHYSICAL',
  CASH = 'CASH',
  QUOTA = 'QUOTA',
  FREE_CONTRIBUTION = 'FREE_CONTRIBUTION',
}

export enum UpdatePriceMode {
  FIXED = 'FIXED',
  FLEXIBLE = 'FLEXIBLE',
}

export enum UpdateGiftStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  PURCHASED = 'PURCHASED',
  PARTIALLY_FUNDED = 'PARTIALLY_FUNDED',
  DISABLED = 'DISABLED',
}

export class UpdateGiftDto {
  @IsOptional()
  @IsString()
  title?: string;

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
  @IsEnum(UpdateGiftType)
  giftType?: UpdateGiftType;

  @IsOptional()
  @IsEnum(UpdatePriceMode)
  priceMode?: UpdatePriceMode;

  @IsOptional()
  @IsEnum(UpdateGiftStatus)
  giftStatus?: UpdateGiftStatus;

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