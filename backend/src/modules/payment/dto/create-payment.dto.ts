import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID('4', { message: 'eventId deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'eventId é obrigatório.' })
  eventId: string;

  @IsOptional()
  @IsUUID('4', { message: 'giftId deve ser um UUID válido.' })
  giftId?: string;

  @IsString({ message: 'buyerName deve ser texto.' })
  @IsNotEmpty({ message: 'buyerName é obrigatório.' })
  @MaxLength(120, { message: 'buyerName deve ter no máximo 120 caracteres.' })
  buyerName: string;

  @IsEmail({}, { message: 'buyerEmail deve ser um e-mail válido.' })
  @IsNotEmpty({ message: 'buyerEmail é obrigatório.' })
  @MaxLength(160, { message: 'buyerEmail deve ter no máximo 160 caracteres.' })
  buyerEmail: string;

  @IsString({ message: 'buyerPhone deve ser texto.' })
  @IsNotEmpty({ message: 'buyerPhone é obrigatório.' })
  @MaxLength(40, { message: 'buyerPhone deve ter no máximo 40 caracteres.' })
  buyerPhone: string;

  @IsString({ message: 'paymentMethod deve ser texto.' })
  @IsNotEmpty({ message: 'paymentMethod é obrigatório.' })
  @MaxLength(40, { message: 'paymentMethod deve ter no máximo 40 caracteres.' })
  paymentMethod: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'amount deve ser um número válido com até 2 casas decimais.' },
  )
  @Min(1, { message: 'amount deve ser maior ou igual a 1.' })
  amount: number;

  @IsOptional()
  @IsString({ message: 'message deve ser texto.' })
  @MaxLength(500, { message: 'message deve ter no máximo 500 caracteres.' })
  message?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'quotaQuantity deve ser um número inteiro.' })
  @Min(1, { message: 'quotaQuantity deve ser maior ou igual a 1.' })
  quotaQuantity?: number;
}