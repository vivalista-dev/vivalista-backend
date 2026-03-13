import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GuestStatus } from '@prisma/client';

@Injectable()
export class RsvpService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCode(code: string) {
    const guest = await this.prisma.guest.findUnique({
      where: { rsvpCode: code },
      include: {
        event: true,
      },
    });

    if (!guest) {
      throw new NotFoundException('Convite não encontrado');
    }

    return guest;
  }

  async updateStatus(code: string, status: GuestStatus) {
    const allowedStatuses: GuestStatus[] = [
      GuestStatus.CONFIRMED,
      GuestStatus.DECLINED,
      GuestStatus.INVITED,
    ];

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException('Status inválido');
    }

    const guest = await this.prisma.guest.findUnique({
      where: { rsvpCode: code },
    });

    if (!guest) {
      throw new NotFoundException('Convite não encontrado');
    }

    return this.prisma.guest.update({
      where: { rsvpCode: code },
      data: {
        status: status,
      },
    });
  }
}