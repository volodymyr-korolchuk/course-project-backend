import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FleetService } from './fleet.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('fleet')
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Post()
  create(@Body() createFleetDto: CreateVehicleDto) {
    return this.fleetService.create(createFleetDto);
  }

  @Get()
  findAll() {
    return this.fleetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fleetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFleetDto: UpdateVehicleDto) {
    return this.fleetService.update(+id, updateFleetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fleetService.remove(+id);
  }
}
