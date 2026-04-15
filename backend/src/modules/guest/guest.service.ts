import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

type GuestStatus = 'INVITED' | 'CONFIRMED' | 'DECLINED';

@Injectable()
export class GuestService {
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

  private normalizeGuestStatus(value: unknown): GuestStatus | undefined {
    if (value === undefined) return undefined;

    const normalized = String(value).trim().toUpperCase();

    if (
      normalized !== 'INVITED' &&
      normalized !== 'CONFIRMED' &&
      normalized !== 'DECLINED'
    ) {
      throw new BadRequestException(
        'status inválido. Use INVITED, CONFIRMED ou DECLINED.',
      );
    }

    return normalized as GuestStatus;
  }

  private async assertEventBelongsToOrg(
    eventId: string,
    organizationId: string,
  ) {
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
      throw new NotFoundException(
        'Evento não encontrado para esta organização.',
      );
    }

    return event;
  }

  private async assertGuestBelongsToEventAndOrg(
    guestId: string,
    eventId: string,
    organizationId: string,
  ) {
    const guest = await this.prisma.guest.findFirst({
      where: {
        id: guestId,
        organizationId,
        eventId,
      },
    });

    if (!guest) {
      throw new NotFoundException('Convidado não encontrado.');
    }

    return guest;
  }

  private async ensureGuestEmailIsUniqueInEvent(
    organizationId: string,
    eventId: string,
    email?: string | null,
    ignoreGuestId?: string,
  ) {
    if (!email) return;

    const existingGuest = await this.prisma.guest.findFirst({
      where: {
        organizationId,
        eventId,
        email,
        ...(ignoreGuestId
          ? {
              NOT: {
                id: ignoreGuestId,
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (existingGuest) {
      throw new BadRequestException(
        'Já existe um convidado com este e-mail neste evento.',
      );
    }
  }

  private async ensureGuestPhoneIsUniqueInEvent(
    organizationId: string,
    eventId: string,
    phone?: string | null,
    ignoreGuestId?: string,
  ) {
    if (!phone) return;

    const existingGuest = await this.prisma.guest.findFirst({
      where: {
        organizationId,
        eventId,
        phone,
        ...(ignoreGuestId
          ? {
              NOT: {
                id: ignoreGuestId,
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (existingGuest) {
      throw new BadRequestException(
        'Já existe um convidado com este telefone neste evento.',
      );
    }
  }

  private generateRsvpCode(length = 6): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  private async generateUniqueRsvpCode(): Promise<string> {
    let code = '';
    let exists = true;

    while (exists) {
      code = this.generateRsvpCode();

      const guest = await this.prisma.guest.findUnique({
        where: { rsvpCode: code },
        select: { id: true },
      });

      exists = !!guest;
    }

    return code;
  }

  private buildCreateGuestData(
    organizationId: string,
    eventId: string,
    dto: CreateGuestDto,
    rsvpCode: string,
  ) {
    const name = this.normalizeRequiredString(dto.name, 'Nome do convidado');
    const email = this.normalizeOptionalString(dto.email);
    const phone = this.normalizeOptionalString(dto.phone);

    return {
      organizationId,
      eventId,
      name,
      email,
      phone,
      status: 'INVITED' as GuestStatus,
      rsvpCode,
    };
  }

  private buildUpdateGuestData(dto: UpdateGuestDto) {
    return {
      name:
        dto.name !== undefined
          ? this.normalizeRequiredString(dto.name, 'Nome do convidado')
          : undefined,
      email:
        dto.email !== undefined
          ? this.normalizeOptionalString(dto.email)
          : undefined,
      phone:
        dto.phone !== undefined
          ? this.normalizeOptionalString(dto.phone)
          : undefined,
      status:
        dto.status !== undefined
          ? this.normalizeGuestStatus(dto.status)
          : undefined,
    };
  }

  async create(
    organizationId: string,
    eventId: string,
    dto: CreateGuestDto,
  ) {
    await this.assertEventBelongsToOrg(eventId, organizationId);

    const normalizedEmail = this.normalizeOptionalString(dto.email);
    const normalizedPhone = this.normalizeOptionalString(dto.phone);

    await this.ensureGuestEmailIsUniqueInEvent(
      organizationId,
      eventId,
      normalizedEmail,
    );
    await this.ensureGuestPhoneIsUniqueInEvent(
      organizationId,
      eventId,
      normalizedPhone,
    );

    const rsvpCode = await this.generateUniqueRsvpCode();

    return this.prisma.guest.create({
      data: this.buildCreateGuestData(organizationId, eventId, dto, rsvpCode),
    });
  }

  async findAllByEvent(organizationId: string, eventId: string) {
    await this.assertEventBelongsToOrg(eventId, organizationId);

    return this.prisma.guest.findMany({
      where: {
        organizationId,
        eventId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(
    organizationId: string,
    eventId: string,
    guestId: string,
  ) {
    await this.assertEventBelongsToOrg(eventId, organizationId);

    return this.assertGuestBelongsToEventAndOrg(
      guestId,
      eventId,
      organizationId,
    );
  }

  async update(
    organizationId: string,
    eventId: string,
    guestId: string,
    dto: UpdateGuestDto,
  ) {
    await this.assertEventBelongsToOrg(eventId, organizationId);

    const existingGuest = await this.assertGuestBelongsToEventAndOrg(
      guestId,
      eventId,
      organizationId,
    );

    const nextEmail =
      dto.email !== undefined
        ? this.normalizeOptionalString(dto.email)
        : existingGuest.email;

    const nextPhone =
      dto.phone !== undefined
        ? this.normalizeOptionalString(dto.phone)
        : existingGuest.phone;

    await this.ensureGuestEmailIsUniqueInEvent(
      organizationId,
      eventId,
      nextEmail,
      existingGuest.id,
    );
    await this.ensureGuestPhoneIsUniqueInEvent(
      organizationId,
      eventId,
      nextPhone,
      existingGuest.id,
    );

    return this.prisma.guest.update({
      where: { id: existingGuest.id },
      data: this.buildUpdateGuestData(dto),
    });
  }

  async remove(
    organizationId: string,
    eventId: string,
    guestId: string,
  ) {
    await this.assertEventBelongsToOrg(eventId, organizationId);

    const existingGuest = await this.assertGuestBelongsToEventAndOrg(
      guestId,
      eventId,
      organizationId,
    );

    return this.prisma.guest.delete({
      where: { id: existingGuest.id },
    });
  }
}