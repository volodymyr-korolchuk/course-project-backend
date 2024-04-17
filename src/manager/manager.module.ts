import { Global, Module } from '@nestjs/common';
import { PrismaClientManager } from './manager.service';

@Global()
@Module({
  providers: [PrismaClientManager],
  exports: [PrismaClientManager],
})
export class ManagerModule {}
