import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    description?: string;
    date: Date;
    location?: string;
    capacity?: number;
    organizationId: string;
  }) {
    return this.prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        date: data.date,
        location: data.location,
        capacity: data.capacity,
        organizationId: data.organizationId,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.event.findMany({
      where: { organizationId },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }

  async update(
    id: string,
    organizationId: string,
    data: Partial<{
      name: string;
      description?: string;
      date: Date;
      location?: string;
      capacity?: number;
    }>,
  ) {
    await this.findOne(id, organizationId);

    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);

    return this.prisma.event.delete({
      where: { id },
    });
  }
}