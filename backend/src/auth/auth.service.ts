import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Resend } from 'resend';
import { PrismaService } from '../modules/prisma/prisma.service';
import { Role } from './roles.enum';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  organizationName: string;
};

type ForgotPasswordInput = {
  email: string;
};

type ResetPasswordInput = {
  token: string;
  newPassword: string;
  email?: string;
};

type PasswordResetEmailStatus = 'sent' | 'skipped' | 'failed';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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

  private hashPasswordResetToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private getFrontendBaseUrl(): string {
    const baseFrontendUrl = (
      process.env.FRONTEND_URL ||
      process.env.NEXT_PUBLIC_FRONTEND_URL ||
      'http://localhost:3000'
    )
      .trim()
      .replace(/\/$/, '');

    if (!/^https?:\/\//.test(baseFrontendUrl)) {
      throw new Error(
        'FRONTEND_URL inválida. Use uma URL completa, por exemplo: https://vivalista.com.br',
      );
    }

    return baseFrontendUrl;
  }

  private getResendConfig(): { apiKey: string; fromEmail: string } | null {
    const apiKey = String(process.env.RESEND_API_KEY || '').trim();

    if (!apiKey) {
      return null;
    }

    const fromEmail = String(
      process.env.RESEND_FROM_EMAIL || 'VivaLista <onboarding@resend.dev>',
    ).trim();

    if (!fromEmail) {
      return null;
    }

    return {
      apiKey,
      fromEmail,
    };
  }

  private buildPasswordResetEmailHtml(resetLink: string): string {
    return `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Recuperação de senha VivaLista</title>
        </head>
        <body style="margin:0;padding:0;background:#f6f1ff;font-family:Arial,Helvetica,sans-serif;color:#1f1638;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1ff;padding:28px 12px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:28px;overflow:hidden;border:1px solid #eee7ff;box-shadow:0 18px 48px rgba(59,35,113,0.12);">
                  <tr>
                    <td style="padding:34px 34px 26px;background:linear-gradient(135deg,#26104d,#6d35d6);color:#ffffff;">
                      <div style="display:inline-block;padding:8px 13px;border-radius:999px;background:rgba(255,255,255,0.14);font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#f5d77d;">
                        Link seguro
                      </div>
                      <h1 style="margin:18px 0 0;font-size:30px;line-height:1.08;letter-spacing:-0.8px;">
                        Redefina sua senha no VivaLista
                      </h1>
                      <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.78);">
                        Recebemos uma solicitação para recuperar o acesso da sua conta.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px 34px 34px;">
                      <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#5b526f;">
                        Para criar uma nova senha, clique no botão abaixo. Este link é temporário e expira em 30 minutos.
                      </p>

                      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
                        <tr>
                          <td style="border-radius:999px;background:linear-gradient(135deg,#6d35d6,#24103f);">
                            <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:15px 26px;border-radius:999px;color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;letter-spacing:0.4px;">
                              Criar nova senha
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 12px;font-size:13px;line-height:1.7;color:#7c728f;">
                        Se o botão não funcionar, copie e cole este link no navegador:
                      </p>

                      <p style="margin:0;padding:14px;border-radius:14px;background:#f7f3ff;border:1px solid #eee7ff;font-size:12px;line-height:1.6;color:#4d3f73;word-break:break-all;">
                        ${resetLink}
                      </p>

                      <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#7c728f;">
                        Se você não solicitou essa recuperação, ignore este e-mail. Sua senha atual continuará a mesma.
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="margin:18px 0 0;font-size:12px;color:#9b90af;">
                  VivaLista • Recuperação de acesso
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private buildPasswordResetEmailText(resetLink: string): string {
    return [
      'Recuperação de senha - VivaLista',
      '',
      'Recebemos uma solicitação para recuperar o acesso da sua conta.',
      'Para criar uma nova senha, acesse o link abaixo:',
      resetLink,
      '',
      'Este link expira em 30 minutos.',
      'Se você não solicitou essa recuperação, ignore este e-mail.',
    ].join('\n');
  }

  private async sendPasswordResetEmail(params: {
    email: string;
    resetLink: string;
  }): Promise<PasswordResetEmailStatus> {
    const resendConfig = this.getResendConfig();

    if (!resendConfig) {
      this.logger.warn(
        'RESEND_API_KEY não configurada. E-mail real de recuperação não foi enviado.',
      );

      return 'skipped';
    }

    try {
      const resend = new Resend(resendConfig.apiKey);

      const { error } = await resend.emails.send({
        from: resendConfig.fromEmail,
        to: [params.email],
        subject: 'Recuperação de senha - VivaLista',
        html: this.buildPasswordResetEmailHtml(params.resetLink),
        text: this.buildPasswordResetEmailText(params.resetLink),
      });

      if (error) {
        this.logger.error(
          `Erro ao enviar e-mail de recuperação pelo Resend: ${JSON.stringify(error)}`,
        );

        return 'failed';
      }

      return 'sent';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Erro inesperado ao enviar e-mail de recuperação: ${errorMessage}`,
      );

      return 'failed';
    }
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

  async forgotPassword(data: ForgotPasswordInput) {
    const email = this.normalizeEmail(data.email);

    const responseMessage =
      'Se este e-mail estiver cadastrado, enviaremos as instruções de recuperação.';

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return {
        message: responseMessage,
      };
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashPasswordResetToken(rawToken);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 30);

    await this.prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        OR: [
          { usedAt: null },
          { expiresAt: { lt: now } },
        ],
      },
    });

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        email: user.email,
        tokenHash,
        expiresAt,
      },
    });

    const baseFrontendUrl = this.getFrontendBaseUrl();

    const resetLink = `${baseFrontendUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(
      user.email,
    )}`;

    const emailStatus = await this.sendPasswordResetEmail({
      email: user.email,
      resetLink,
    });

    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.AUTH_RESET_DEBUG === 'true'
    ) {
      return {
        message: responseMessage,
        devResetLink: resetLink,
        devResetToken: rawToken,
        expiresAt,
        emailStatus,
      };
    }

    return {
      message: responseMessage,
    };
  }

  async resetPassword(data: ResetPasswordInput) {
    const rawToken = this.normalizeRequiredString(data.token, 'Token');
    const newPassword = this.validatePassword(data.newPassword);
    const email = data.email ? this.normalizeEmail(data.email) : undefined;

    const tokenHash = this.hashPasswordResetToken(rawToken);
    const now = new Date();

    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: {
          gt: now,
        },
        ...(email ? { email } : {}),
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!resetToken) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction(async (tx) => {
      const markedToken = await tx.passwordResetToken.updateMany({
        where: {
          id: resetToken.id,
          usedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        data: {
          usedAt: now,
        },
      });

      if (markedToken.count !== 1) {
        throw new BadRequestException('Token inválido ou expirado.');
      }

      await tx.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      await tx.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
          id: {
            not: resetToken.id,
          },
        },
      });
    });

    return {
      message: 'Senha redefinida com sucesso.',
    };
  }
}
