import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeOrganizationId(id: string): string {
    const normalized = String(id || '').trim();

    if (!normalized) {
      throw new BadRequestException('organizationId é obrigatório.');
    }

    return normalized;
  }

  private async findOrganizationEntityOrFail(id: string) {
    const organizationId = this.normalizeOrganizationId(id);

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada.');
    }

    return organization;
  }

  private async findPaymentSettingsEntityOrFail(id: string) {
    const organizationId = this.normalizeOrganizationId(id);

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
      throw new NotFoundException('Organização não encontrada.');
    }

    return organization;
  }

  async findAll() {
    return this.prisma.organization.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.findOrganizationEntityOrFail(id);
  }

  async getPaymentSettings(organizationId: string) {
    const organization =
      await this.findPaymentSettingsEntityOrFail(organizationId);

    return {
      message: 'Configuração de pagamento carregada com sucesso.',
      organization,
    };
  }

  async updatePaymentSettings(
    organizationId: string,
    dto: UpdatePaymentSettingsDto,
  ) {
    await this.findOrganizationEntityOrFail(organizationId);

    const normalizedOrganizationId =
      this.normalizeOrganizationId(organizationId);

    const updatedOrganization = await this.prisma.organization.update({
      where: { id: normalizedOrganizationId },
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
    const organization = await this.findOrganizationEntityOrFail(id);

    return this.prisma.organization.delete({
      where: { id: organization.id },
    });
  }
}