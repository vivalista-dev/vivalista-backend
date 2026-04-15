import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuestStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RsvpService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeCode(code: string): string {
    const normalized = String(code || '').trim().toUpperCase();

    if (!normalized) {
      throw new BadRequestException('Código RSVP é obrigatório.');
    }

    return normalized;
  }

  private normalizeGuestStatus(status: GuestStatus): GuestStatus {
    const allowedStatuses: GuestStatus[] = [
      GuestStatus.INVITED,
      GuestStatus.CONFIRMED,
      GuestStatus.DECLINED,
    ];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException(
        'Status inválido. Use INVITED, CONFIRMED ou DECLINED.',
      );
    }

    return status;
  }

  private async findGuestEntityByCode(code: string) {
    const normalizedCode = this.normalizeCode(code);

    const guest = await this.prisma.guest.findUnique({
      where: { rsvpCode: normalizedCode },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            date: true,
            location: true,
            status: true,
          },
        },
      },
    });

    if (!guest) {
      throw new NotFoundException('Convite não encontrado.');
    }

    if (!guest.event) {
      throw new NotFoundException('Evento do convite não encontrado.');
    }

    return guest;
  }

  private mapGuestResponse(guest: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    status: GuestStatus;
    rsvpCode: string | null;
    createdAt: Date;
    event: {
      id: string;
      name: string;
      slug: string | null;
      date: Date;
      location: string;
      status: string;
    };
  }) {
    return {
      guestId: guest.id,
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      status: guest.status,
      rsvpCode: guest.rsvpCode,
      createdAt: guest.createdAt,
      event: {
        id: guest.event.id,
        name: guest.event.name,
        slug: guest.event.slug,
        date: guest.event.date,
        location: guest.event.location,
        status: guest.event.status,
      },
    };
  }

  async findByCode(code: string) {
    const guest = await this.findGuestEntityByCode(code);

    return this.mapGuestResponse({
      id: guest.id,
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      status: guest.status,
      rsvpCode: guest.rsvpCode,
      createdAt: guest.createdAt,
      event: {
        id: guest.event.id,
        name: guest.event.name,
        slug: guest.event.slug,
        date: guest.event.date,
        location: guest.event.location,
        status: guest.event.status,
      },
    });
  }

  async updateStatus(code: string, status: GuestStatus) {
    const normalizedCode = this.normalizeCode(code);
    const normalizedStatus = this.normalizeGuestStatus(status);

    const guest = await this.findGuestEntityByCode(normalizedCode);

    const updatedGuest = await this.prisma.guest.update({
      where: { rsvpCode: normalizedCode },
      data: {
        status: normalizedStatus,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            date: true,
            location: true,
            status: true,
          },
        },
      },
    });

    return {
      message:
        normalizedStatus === GuestStatus.CONFIRMED
          ? 'Presença confirmada com sucesso.'
          : normalizedStatus === GuestStatus.DECLINED
            ? 'Presença recusada com sucesso.'
            : 'Status do RSVP atualizado com sucesso.',
      previousStatus: guest.status,
      guest: this.mapGuestResponse({
        id: updatedGuest.id,
        name: updatedGuest.name,
        email: updatedGuest.email,
        phone: updatedGuest.phone,
        status: updatedGuest.status,
        rsvpCode: updatedGuest.rsvpCode,
        createdAt: updatedGuest.createdAt,
        event: {
          id: updatedGuest.event.id,
          name: updatedGuest.event.name,
          slug: updatedGuest.event.slug,
          date: updatedGuest.event.date,
          location: updatedGuest.event.location,
          status: updatedGuest.event.status,
        },
      }),
    };
  }
}