import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../modules/prisma/prisma.service';
import { Role } from './roles.enum';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  organizationName: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private normalizeRequiredString(value: unknown, fieldLabel: string): string {
    const normalized = String(value || '').trim();

    if (!normalized) {
      throw new BadRequestException(`${fieldLabel} é obrigatório.`);
    }

    return normalized;
  }

  private normalizeEmail(email: unknown): string {
    const normalized = this.normalizeRequiredString(email, 'E-mail').toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new BadRequestException('E-mail inválido.');
    }

    return normalized;
  }

  private validatePassword(password: unknown): string {
    const normalized = this.normalizeRequiredString(password, 'Senha');

    if (normalized.length < 6) {
      throw new BadRequestException('A senha deve ter pelo menos 6 caracteres.');
    }

    return normalized;
  }

  private buildJwtPayload(user: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  }) {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
  }

  async register(data: RegisterInput) {
    const name = this.normalizeRequiredString(data.name, 'Nome');
    const email = this.normalizeEmail(data.email);
    const password = this.validatePassword(data.password);
    const organizationName = this.normalizeRequiredString(
      data.organizationName,
      'Nome da organização',
    );

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Já existe um usuário com este e-mail.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.OWNER,
        organization: {
          create: {
            name: organizationName,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true,
      },
    });

    return {
      message: 'Usuário registrado com sucesso.',
      user,
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const normalizedPassword = this.validatePassword(password);

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        organizationId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const passwordValid = await bcrypt.compare(
      normalizedPassword,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = this.buildJwtPayload({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login realizado com sucesso.',
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }
}