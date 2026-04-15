import { IsBooleanString, IsOptional, IsString, IsUUID } from 'class-validator';

export class ListGiftsDto {
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @IsOptional()
  @IsString()
  giftType?: string;

  @IsOptional()
  @IsString()
  giftStatus?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;

  @IsOptional()
  @IsBooleanString()
  isFeatured?: string;
}