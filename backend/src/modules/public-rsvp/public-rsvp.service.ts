import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type PublicRsvpStatus = 'INVITED' | 'CONFIRMED' | 'DECLINED';
type PublicRsvpResponseStatus = 'CONFIRMED' | 'DECLINED';

@Injectable()
export class PublicRsvpService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeCode(code: string): string {
    const normalized = String(code || '').trim().toUpperCase();

    if (!normalized) {
      throw new BadRequestException('Código RSVP é obrigatório.');
    }

    return normalized;
  }

  private normalizeResponseStatus(
    status: string,
  ): PublicRsvpResponseStatus {
    const normalized = String(status || '').trim().toUpperCase();

    if (normalized !== 'CONFIRMED' && normalized !== 'DECLINED') {
      throw new BadRequestException(
        'Status inválido. Use CONFIRMED ou DECLINED.',
      );
    }

    return normalized as PublicRsvpResponseStatus;
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

    if (guest.event.status !== 'PUBLISHED') {
      throw new NotFoundException(
        'Este convite não está disponível para resposta pública.',
      );
    }

    return guest;
  }

  private mapGuestResponse(guest: {
    id: string;
    name: string;
    status: PublicRsvpStatus;
    event: {
      id: string;
      name: string;
      slug: string | null;
      date: Date;
      location: string;
    };
  }) {
    return {
      guestId: guest.id,
      name: guest.name,
      status: guest.status,
      event: {
        id: guest.event.id,
        name: guest.event.name,
        slug: guest.event.slug,
        date: guest.event.date,
        location: guest.event.location,
      },
    };
  }

  async findGuestByCode(code: string) {
    const guest = await this.findGuestEntityByCode(code);

    return this.mapGuestResponse({
      id: guest.id,
      name: guest.name,
      status: guest.status as PublicRsvpStatus,
      event: {
        id: guest.event.id,
        name: guest.event.name,
        slug: guest.event.slug,
        date: guest.event.date,
        location: guest.event.location,
      },
    });
  }

  async respond(code: string, status: 'CONFIRMED' | 'DECLINED') {
    const normalizedStatus = this.normalizeResponseStatus(status);
    const guest = await this.findGuestEntityByCode(code);

    const updatedGuest = await this.prisma.guest.update({
      where: { id: guest.id },
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
          },
        },
      },
    });

    return {
      message:
        normalizedStatus === 'CONFIRMED'
          ? 'Presença confirmada com sucesso.'
          : 'Resposta registrada com sucesso.',
      guest: this.mapGuestResponse({
        id: updatedGuest.id,
        name: updatedGuest.name,
        status: updatedGuest.status as PublicRsvpStatus,
        event: {
          id: updatedGuest.event.id,
          name: updatedGuest.event.name,
          slug: updatedGuest.event.slug,
          date: updatedGuest.event.date,
          location: updatedGuest.event.location,
        },
      }),
    };
  }
}