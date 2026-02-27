import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  organizationName: string;

  @IsString()
  ownerName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
