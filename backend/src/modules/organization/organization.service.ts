import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany();
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    return organization;
  }

  async getPaymentSettings(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        paymentGateway: true,
        paymentAccountId: true,
        paymentAccountStatus: true,
        paymentAccountReady: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    return {
      message: 'Configuração de pagamento carregada com sucesso.',
      organization,
    };
  }

  async updatePaymentSettings(
    organizationId: string,
    dto: UpdatePaymentSettingsDto,
  ) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    const updatedOrganization = await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        paymentGateway: dto.paymentGateway,
        paymentAccountId: dto.paymentAccountId,
        paymentAccountStatus: dto.paymentAccountStatus,
        paymentAccountReady: dto.paymentAccountReady,
      },
      select: {
        id: true,
        name: true,
        paymentGateway: true,
        paymentAccountId: true,
        paymentAccountStatus: true,
        paymentAccountReady: true,
      },
    });

    return {
      message: 'Configuração de pagamento atualizada com sucesso.',
      organization: updatedOrganization,
    };
  }

  async remove(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    return this.prisma.organization.delete({
      where: { id },
    });
  }
}