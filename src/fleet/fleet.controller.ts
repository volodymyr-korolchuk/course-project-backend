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
import { FleetService } from './fleet.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { TenantId } from 'src/common/decorators/tenand-id.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DB_ROLES } from 'src/constants';

@Controller('fleet')
@UseGuards(JwtGuard, RolesGuard)
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Post()
  @Roles([DB_ROLES.Employee])
  create(
    @TenantId() tenantId: string,
    @Body() createFleetDto: CreateVehicleDto,
  ) {
    return this.fleetService.create(tenantId, createFleetDto);
  }

  @Get()
  @Roles(Object.values(DB_ROLES).filter((x) => x !== DB_ROLES.Guest))
  findAll(@TenantId() tenantId: string) {
    return this.fleetService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(Object.values(DB_ROLES).filter((x) => x !== DB_ROLES.Guest))
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.fleetService.findOne(tenantId, +id);
  }

  @Patch(':id')
  @Roles([DB_ROLES.Employee])
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateFleetDto: UpdateVehicleDto,
  ) {
    return this.fleetService.update(tenantId, +id, updateFleetDto);
  }

  @Delete(':id')
  @Roles([DB_ROLES.Employee])
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.fleetService.remove(tenantId, +id);
  }
}
