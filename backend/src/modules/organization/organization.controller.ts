import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { OrganizationService } from './organization.service'

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() body: { name: string }) {
    return this.organizationService.create(body.name)
  }

  @Get()
  findAll() {
    return this.organizationService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(Number(id))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(Number(id))
  }
}