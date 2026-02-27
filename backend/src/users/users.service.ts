import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    organizationId: number;
  }) {
    const bcrypt = require('bcrypt');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        role: 'STAFF',
        organization: {
          connect: { id: data.organizationId },
        },
      },
    });
  }
}