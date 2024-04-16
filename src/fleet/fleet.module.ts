import { Module } from '@nestjs/common';
import { FleetService } from './fleet.service';
import { FleetController } from './fleet.controller';

@Module({
  controllers: [FleetController],
  providers: [FleetService],
})
export class FleetModule {}
