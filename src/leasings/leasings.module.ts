import { Module } from '@nestjs/common';
import { LeasingsService } from './leasings.service';
import { LeasingsController } from './leasings.controller';

@Module({
  controllers: [LeasingsController],
  providers: [LeasingsService],
})
export class LeasingsModule {}
