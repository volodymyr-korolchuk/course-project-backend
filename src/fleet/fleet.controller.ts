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
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { TenantId } from 'src/common/decorators/extract-tenant-id.decorator';

@Controller('fleet')
@UseGuards(JwtGuard)
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Post()
  create(
    @TenantId() tenantId: string,
    @Body() createFleetDto: CreateVehicleDto,
  ) {
    return this.fleetService.create(tenantId, createFleetDto);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.fleetService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.fleetService.findOne(tenantId, +id);
  }

  @Patch(':id')
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateFleetDto: UpdateVehicleDto,
  ) {
    return this.fleetService.update(tenantId, +id, updateFleetDto);
  }

  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.fleetService.remove(tenantId, +id);
  }
}
