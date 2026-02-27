import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    return this.prisma.organization.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      },
    })
  }

  async findAll() {
    return this.prisma.organization.findMany()
  }

  async findOne(id: number) {
    return this.prisma.organization.findUnique({
      where: { id },
    })
  }

  async remove(id: number) {
    return this.prisma.organization.delete({
      where: { id },
    })
  }
}