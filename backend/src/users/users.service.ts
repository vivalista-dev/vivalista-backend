import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private validateOrganizationId(organizationId: string) {
    const normalized = String(organizationId || '').trim();

    if (!normalized) {
      throw new BadRequestException('organizationId é obrigatório.');
    }

    return normalized;
  }

  private validateUserId(id: string) {
    const normalized = String(id || '').trim();

    if (!normalized) {
      throw new BadRequestException('id do usuário é obrigatório.');
    }

    return normalized;
  }

  private validateRole(role: Role) {
    const allowedRoles = Object.values(Role);

    if (!allowedRoles.includes(role)) {
      throw new BadRequestException('Role inválida.');
    }

    return role;
  }

  private async findUserEntityOrFail(id: string, organizationId: string) {
    const normalizedUserId = this.validateUserId(id);
    const normalizedOrganizationId =
      this.validateOrganizationId(organizationId);

    const user = await this.prisma.user.findFirst({
      where: {
        id: normalizedUserId,
        organizationId: normalizedOrganizationId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async findAll(organizationId: string) {
    const normalizedOrganizationId =
      this.validateOrganizationId(organizationId);

    return this.prisma.user.findMany({
      where: {
        organizationId: normalizedOrganizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, organizationId: string) {
    return this.findUserEntityOrFail(id, organizationId);
  }

  async updateRole(id: string, organizationId: string, role: Role) {
    const user = await this.findUserEntityOrFail(id, organizationId);
    const normalizedRole = this.validateRole(role);

    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        role: normalizedRole,
      },
    });
  }

  async remove(id: string, organizationId: string) {
    const user = await this.findUserEntityOrFail(id, organizationId);

    return this.prisma.user.delete({
      where: { id: user.id },
    });
  }
}