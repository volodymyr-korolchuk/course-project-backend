import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LeasingsService } from './leasings.service';
import { CreateLeasingDto } from './dto/create-leasing.dto';
import { UpdateLeasingDto } from './dto/update-leasing.dto';
import { TenantId } from 'src/common/decorators/tenand-id.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DB_ROLES } from 'src/constants';

@Controller('leasings')
@UseGuards(JwtGuard, RolesGuard)
export class LeasingsController {
  constructor(private readonly leasingsService: LeasingsService) {}

  @Post()
  @Roles([DB_ROLES.Customer, DB_ROLES.Employee])
  create(
    @TenantId() tenantId: string,
    @Body() createLeasingDto: CreateLeasingDto,
  ) {
    return this.leasingsService.create(tenantId, createLeasingDto);
  }

  @Get()
  @Roles([DB_ROLES.Employee])
  findAll(@TenantId() tenantId) {
    return this.leasingsService.findAll(tenantId);
  }

  @Get('todays-pickups')
  @Roles([DB_ROLES.Employee])
  findTodaysPickups(@TenantId() tenantId) {
    return this.leasingsService.findTodaysPickups(tenantId);
  }
  @Get('todays-returns')
  @Roles([DB_ROLES.Employee])
  findTodaysReturns(@TenantId() tenantId) {
    return this.leasingsService.findTodaysReturns(tenantId);
  }

  @Get('tomorrows-pickups')
  @Roles([DB_ROLES.Employee])
  findTomorrowsPickups(@TenantId() tenantId) {
    return this.leasingsService.findTomorrowsPickups(tenantId);
  }

  @Get('tomorrows-returns')
  @Roles([DB_ROLES.Employee])
  findTomorrowsReturns(@TenantId() tenantId) {
    return this.leasingsService.findTomorrowsReturns(tenantId);
  }

  @Get(':id')
  @Roles([DB_ROLES.Customer, DB_ROLES.Employee])
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.leasingsService.findOne(tenantId, +id);
  }

  @Patch(':id')
  @Roles([DB_ROLES.Employee])
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateLeasingDto: UpdateLeasingDto,
  ) {
    return this.leasingsService.update(tenantId, +id, updateLeasingDto);
  }

  @Delete(':id')
  @Roles([DB_ROLES.Employee])
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.leasingsService.remove(tenantId, +id);
  }
}
