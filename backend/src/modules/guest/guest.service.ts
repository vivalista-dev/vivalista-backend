import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertEventBelongsToOrg(
    eventId: string,
    organizationId: string,
  ) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId: organizationId,
      },
      select: { id: true },
    });

    if (!event) {
      throw new NotFoundException(
        'Evento não encontrado para esta organização.',
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

  async create(
    organizationId: string,
    eventId: string,
    dto: CreateGuestDto,
  ) {
    await this.assertEventBelongsToOrg(eventId, organizationId);

    const rsvpCode = await this.generateUniqueRsvpCode();

    return this.prisma.guest.create({
      data: {
        organizationId,
        eventId,
        name: dto.name,
        email: dto.email ?? null,
        phone: dto.phone ?? null,
        status: 'INVITED',
        rsvpCode,
      },
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

  async update(
    organizationId: string,
    eventId: string,
    guestId: string,
    dto: UpdateGuestDto,
  ) {
    await this.assertEventBelongsToOrg(eventId, organizationId);

    const existing = await this.prisma.guest.findFirst({
      where: {
        id: guestId,
        organizationId,
        eventId,
      },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Convidado não encontrado.');
    }

    return this.prisma.guest.update({
      where: { id: guestId },
      data: {
        name: dto.name ?? undefined,
        email: dto.email === undefined ? undefined : dto.email ?? null,
        phone: dto.phone === undefined ? undefined : dto.phone ?? null,
        status: dto.status ?? undefined,
      },
    });
  }

  async remove(
    organizationId: string,
    eventId: string,
    guestId: string,
  ) {
    await this.assertEventBelongsToOrg(eventId, organizationId);

    const existing = await this.prisma.guest.findFirst({
      where: {
        id: guestId,
        organizationId,
        eventId,
      },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Convidado não encontrado.');
    }

    return this.prisma.guest.delete({
      where: { id: guestId },
    });
  }
}