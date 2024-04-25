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
import { TenantId } from 'src/common/decorators/extract-tenant-id.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('fleet')
@UseGuards(JwtGuard, RolesGuard)
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Post()
  @Roles(['Employee', 'Admin'])
  create(
    @TenantId() tenantId: string,
    @Body() createFleetDto: CreateVehicleDto,
  ) {
    return this.fleetService.create(tenantId, createFleetDto);
  }

  @Roles(['Customer', 'Employee', 'Admin'])
  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.fleetService.findAll(tenantId);
  }

  @Get(':id')
  @Roles(['Customer', 'Employee', 'Admin'])
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.fleetService.findOne(tenantId, +id);
  }

  @Patch(':id')
  @Roles(['Employee', 'Admin'])
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateFleetDto: UpdateVehicleDto,
  ) {
    return this.fleetService.update(tenantId, +id, updateFleetDto);
  }

  @Roles(['Employee', 'Admin'])
  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.fleetService.remove(tenantId, +id);
  }
}
