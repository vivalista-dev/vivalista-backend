import { IsNotEmpty, IsString, IsUUID, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsUUID()
  @IsNotEmpty()
  giftId: string;

  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @IsString()
  @IsNotEmpty()
  buyerEmail: string;

  @IsString()
  @IsNotEmpty()
  buyerPhone: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsNumber()
  @Min(1)
  amount: number;
}