import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  private async generateUniqueSlug(name: string, ignoreEventId?: string): Promise<string> {
    const baseSlug = this.slugify(name)
    let slug = baseSlug
    let counter = 1

    while (true) {
      const existingEvent = await this.prisma.event.findFirst({
        where: {
          slug,
          ...(ignoreEventId
            ? {
                id: {
                  not: ignoreEventId,
                },
              }
            : {}),
        },
      })

      if (!existingEvent) {
        return slug
      }

      slug = `${baseSlug}-${counter}`
      counter++
    }
  }

  private async findPublicEventEntityBySlug(slug: string) {
    const event = await this.prisma.event.findFirst({
      where: { slug },
    })

    if (!event) {
      throw new NotFoundException('Evento não encontrado')
    }

    if (event.status !== 'PUBLISHED') {
      throw new NotFoundException('Evento não publicado')
    }

    return event
  }

  private async findGuestByEventAndCode(eventId: string, code: string) {
    const guest = await this.prisma.guest.findFirst({
      where: {
        eventId,
        rsvpCode: code,
      },
    })

    if (!guest) {
      throw new NotFoundException('Convidado não encontrado')
    }

    return guest
  }

  private async findGiftByIdAndEvent(eventId: string, giftId: string) {
    const gift = await this.prisma.gift.findFirst({
      where: {
        id: giftId,
        eventId,
      },
    })

    if (!gift) {
      throw new NotFoundException('Presente não encontrado')
    }

    return gift
  }

  private async findGiftByIdEventAndOrg(giftId: string, eventId: string, organizationId: string) {
    await this.findOne(eventId, organizationId)

    const gift = await this.prisma.gift.findFirst({
      where: {
        id: giftId,
        eventId,
        organizationId,
      },
    })

    if (!gift) {
      throw new NotFoundException('Presente não encontrado')
    }

    return gift
  }

  private async buildPublicStats(eventId: string) {
    const totalGuests = await this.prisma.guest.count({
      where: { eventId },
    })

    const confirmedGuests = await this.prisma.guest.count({
      where: {
        eventId,
        status: 'CONFIRMED',
      },
    })

    const declinedGuests = await this.prisma.guest.count({
      where: {
        eventId,
        status: 'DECLINED',
      },
    })

    const pendingGuests = await this.prisma.guest.count({
      where: {
        eventId,
        status: 'INVITED',
      },
    })

    return {
      totalGuests,
      confirmedGuests,
      pendingGuests,
      declinedGuests,
    }
  }

  private async buildPublicGifts(eventId: string) {
    const gifts = await this.prisma.gift.findMany({
      where: {
        eventId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return gifts.map((gift) => ({
      id: gift.id,
      title: gift.title,
      description: gift.description,
      price: gift.price,
      imageUrl: gift.imageUrl,
      purchaseUrl: gift.purchaseUrl,
      isReserved: gift.isReserved,
      isPurchased: gift.isPurchased,
      reservedByName: gift.isReserved ? gift.reservedByName : null,
      reservedAt: gift.isReserved ? gift.reservedAt : null,
      purchasedByName: gift.isPurchased ? gift.purchasedByName : null,
      purchasedAt: gift.isPurchased ? gift.purchasedAt : null,
    }))
  }

  async create(data: any, organizationId: string) {
    const slug = await this.generateUniqueSlug(data.name)

    return this.prisma.event.create({
      data: {
        ...data,
        slug,
        organizationId,
        date: new Date(data.date),
      },
    })
  }

  async findAll(organizationId: string) {
    return this.prisma.event.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string, organizationId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
        organizationId,
      },
    })

    if (!event) {
      throw new NotFoundException('Evento não encontrado')
    }

    return event
  }

  async update(id: string, data: any, organizationId: string) {
    const currentEvent = await this.findOne(id, organizationId)

    let slug = currentEvent.slug

    if (!slug) {
      slug = await this.generateUniqueSlug(data.name ?? currentEvent.name, currentEvent.id)
    } else if (data.name && data.name !== currentEvent.name) {
      slug = await this.generateUniqueSlug(data.name, currentEvent.id)
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...data,
        slug,
        date: data.date ? new Date(data.date) : undefined,
      },
    })
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId)

    return this.prisma.event.delete({
      where: { id },
    })
  }

  async findEventGiftDashboard(eventId: string, organizationId: string) {
    await this.findOne(eventId, organizationId)

    const totalGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
      },
    })

    const activeGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
        isActive: true,
      },
    })

    const reservedGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
        isReserved: true,
      },
    })

    const purchasedGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
        isPurchased: true,
      },
    })

    const availableGifts = await this.prisma.gift.count({
      where: {
        eventId,
        organizationId,
        isActive: true,
        isReserved: false,
        isPurchased: false,
      },
    })

    return {
      eventId,
      dashboard: {
        totalGifts,
        activeGifts,
        reservedGifts,
        purchasedGifts,
        availableGifts,
      },
    }
  }

  async createGift(eventId: string, body: any, organizationId: string) {
    await this.findOne(eventId, organizationId)

    return this.prisma.gift.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        purchaseUrl: body.purchaseUrl,
        isActive: body.isActive ?? true,
        eventId,
        organizationId,
      },
    })
  }

  async findGiftsByEvent(eventId: string, organizationId: string) {
    await this.findOne(eventId, organizationId)

    return this.prisma.gift.findMany({
      where: {
        eventId,
        organizationId,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async updateGift(eventId: string, giftId: string, body: any, organizationId: string) {
    const gift = await this.findGiftByIdEventAndOrg(giftId, eventId, organizationId)

    if (gift.isPurchased && body.isPurchased === false) {
      body.purchasedByName = null
      body.purchasedAt = null
    }

    if (body.isReserved === false) {
      body.reservedByName = null
      body.reservedAt = null
    }

    return this.prisma.gift.update({
      where: { id: gift.id },
      data: {
        title: body.title ?? undefined,
        description: body.description ?? undefined,
        price: body.price ?? undefined,
        imageUrl: body.imageUrl ?? undefined,
        purchaseUrl: body.purchaseUrl ?? undefined,
        isActive: body.isActive ?? undefined,
        isReserved: body.isReserved ?? undefined,
        isPurchased: body.isPurchased ?? undefined,
        reservedByName: body.reservedByName ?? undefined,
        reservedAt: body.reservedAt ? new Date(body.reservedAt) : body.reservedAt === null ? null : undefined,
        purchasedByName: body.purchasedByName ?? undefined,
        purchasedAt: body.purchasedAt ? new Date(body.purchasedAt) : body.purchasedAt === null ? null : undefined,
      },
    })
  }

  async removeGift(eventId: string, giftId: string, organizationId: string) {
    const gift = await this.findGiftByIdEventAndOrg(giftId, eventId, organizationId)

    return this.prisma.gift.delete({
      where: { id: gift.id },
    })
  }

  async findPublicBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug)

    return {
      event: {
        id: event.id,
        name: event.name,
        description: event.description,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        status: event.status,
        slug: event.slug,
      },
      rsvp: {
        enabled: true,
        lookupMode: 'CODE',
      },
    }
  }

  async findPublicStatsBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug)
    const stats = await this.buildPublicStats(event.id)

    return {
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
        status: event.status,
      },
      stats,
    }
  }

  async findPublicFullBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug)
    const stats = await this.buildPublicStats(event.id)
    const gifts = await this.buildPublicGifts(event.id)

    return {
      event: {
        id: event.id,
        name: event.name,
        description: event.description,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        status: event.status,
        slug: event.slug,
      },
      rsvp: {
        enabled: true,
        lookupMode: 'CODE',
      },
      stats,
      gifts,
    }
  }

  async lookupGuestByCode(slug: string, code: string) {
    const event = await this.findPublicEventEntityBySlug(slug)
    const guest = await this.findGuestByEventAndCode(event.id, code)

    return {
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
      },
      guest: {
        id: guest.id,
        name: guest.name,
        status: guest.status,
        rsvpCode: guest.rsvpCode,
      },
    }
  }

  async confirmGuestRsvp(slug: string, code: string) {
    const event = await this.findPublicEventEntityBySlug(slug)
    const guest = await this.findGuestByEventAndCode(event.id, code)

    const updatedGuest = await this.prisma.guest.update({
      where: { id: guest.id },
      data: {
        status: 'CONFIRMED',
      },
    })

    return {
      message: 'Presença confirmada com sucesso',
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
      },
      guest: {
        id: updatedGuest.id,
        name: updatedGuest.name,
        status: updatedGuest.status,
        rsvpCode: updatedGuest.rsvpCode,
      },
    }
  }

  async declineGuestRsvp(slug: string, code: string) {
    const event = await this.findPublicEventEntityBySlug(slug)
    const guest = await this.findGuestByEventAndCode(event.id, code)

    const updatedGuest = await this.prisma.guest.update({
      where: { id: guest.id },
      data: {
        status: 'DECLINED',
      },
    })

    return {
      message: 'Presença recusada com sucesso',
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
      },
      guest: {
        id: updatedGuest.id,
        name: updatedGuest.name,
        status: updatedGuest.status,
        rsvpCode: updatedGuest.rsvpCode,
      },
    }
  }

  async findPublicGiftsBySlug(slug: string) {
    const event = await this.findPublicEventEntityBySlug(slug)
    const gifts = await this.buildPublicGifts(event.id)

    return {
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
      },
      gifts,
    }
  }

  async reserveGiftBySlug(slug: string, giftId: string, body: { reservedByName: string }) {
    const event = await this.findPublicEventEntityBySlug(slug)
    const gift = await this.findGiftByIdAndEvent(event.id, giftId)

    if (!gift.isActive) {
      throw new BadRequestException('Presente inativo')
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Presente já comprado')
    }

    if (gift.isReserved) {
      throw new BadRequestException('Presente já reservado')
    }

    const reservedByName = body?.reservedByName?.trim()

    if (!reservedByName) {
      throw new BadRequestException('Nome de quem vai reservar é obrigatório')
    }

    const updatedGift = await this.prisma.gift.update({
      where: { id: gift.id },
      data: {
        isReserved: true,
        reservedByName,
        reservedAt: new Date(),
      },
    })

    return {
      message: 'Presente reservado com sucesso',
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
      },
      gift: {
        id: updatedGift.id,
        title: updatedGift.title,
        description: updatedGift.description,
        price: updatedGift.price,
        imageUrl: updatedGift.imageUrl,
        purchaseUrl: updatedGift.purchaseUrl,
        isReserved: updatedGift.isReserved,
        isPurchased: updatedGift.isPurchased,
        reservedByName: updatedGift.reservedByName,
        reservedAt: updatedGift.reservedAt,
        purchasedByName: updatedGift.purchasedByName,
        purchasedAt: updatedGift.purchasedAt,
      },
    }
  }

  async unreserveGiftBySlug(slug: string, giftId: string) {
    const event = await this.findPublicEventEntityBySlug(slug)
    const gift = await this.findGiftByIdAndEvent(event.id, giftId)

    if (!gift.isReserved) {
      throw new BadRequestException('Presente não está reservado')
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Presente já comprado')
    }

    const updatedGift = await this.prisma.gift.update({
      where: { id: gift.id },
      data: {
        isReserved: false,
        reservedByName: null,
        reservedAt: null,
      },
    })

    return {
      message: 'Reserva cancelada com sucesso',
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
      },
      gift: {
        id: updatedGift.id,
        title: updatedGift.title,
        description: updatedGift.description,
        price: updatedGift.price,
        imageUrl: updatedGift.imageUrl,
        purchaseUrl: updatedGift.purchaseUrl,
        isReserved: updatedGift.isReserved,
        isPurchased: updatedGift.isPurchased,
        reservedByName: updatedGift.reservedByName,
        reservedAt: updatedGift.reservedAt,
        purchasedByName: updatedGift.purchasedByName,
        purchasedAt: updatedGift.purchasedAt,
      },
    }
  }

  async purchaseGiftBySlug(slug: string, giftId: string, body: { purchasedByName: string }) {
    const event = await this.findPublicEventEntityBySlug(slug)
    const gift = await this.findGiftByIdAndEvent(event.id, giftId)

    if (!gift.isActive) {
      throw new BadRequestException('Presente inativo')
    }

    if (gift.isPurchased) {
      throw new BadRequestException('Presente já comprado')
    }

    const purchasedByName = body?.purchasedByName?.trim()

    if (!purchasedByName) {
      throw new BadRequestException('Nome de quem comprou é obrigatório')
    }

    const updatedGift = await this.prisma.gift.update({
      where: { id: gift.id },
      data: {
        isPurchased: true,
        purchasedByName,
        purchasedAt: new Date(),
        isReserved: true,
        reservedByName: gift.reservedByName ?? purchasedByName,
        reservedAt: gift.reservedAt ?? new Date(),
      },
    })

    return {
      message: 'Presente marcado como comprado com sucesso',
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
      },
      gift: {
        id: updatedGift.id,
        title: updatedGift.title,
        description: updatedGift.description,
        price: updatedGift.price,
        imageUrl: updatedGift.imageUrl,
        purchaseUrl: updatedGift.purchaseUrl,
        isReserved: updatedGift.isReserved,
        isPurchased: updatedGift.isPurchased,
        reservedByName: updatedGift.reservedByName,
        reservedAt: updatedGift.reservedAt,
        purchasedByName: updatedGift.purchasedByName,
        purchasedAt: updatedGift.purchasedAt,
      },
    }
  }
}