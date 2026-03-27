import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicRsvpService {
  constructor(private readonly prisma: PrismaService) {}

  async findGuestByCode(code: string) {
    const guest = await this.prisma.guest.findUnique({
      where: { rsvpCode: code },
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

    if (!guest) {
      throw new NotFoundException('Convite não encontrado.');
    }

    return {
      guestId: guest.id,
      name: guest.name,
      status: guest.status,
      event: guest.event,
    };
  }

  async respond(code: string, status: 'CONFIRMED' | 'DECLINED') {
    const guest = await this.prisma.guest.findUnique({
      where: { rsvpCode: code },
    });

    if (!guest) {
      throw new NotFoundException('Convite não encontrado.');
    }

    return this.prisma.guest.update({
      where: { id: guest.id },
      data: {
        status,
      },
    });
  }
}
