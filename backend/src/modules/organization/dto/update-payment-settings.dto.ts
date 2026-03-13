import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentSettingsDto {
  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @IsOptional()
  @IsString()
  paymentAccountId?: string;

  @IsOptional()
  @IsString()
  paymentAccountStatus?: string;

  @IsOptional()
  @IsBoolean()
  paymentAccountReady?: boolean;
}