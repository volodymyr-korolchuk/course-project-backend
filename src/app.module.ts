import {
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FleetModule } from './fleet/fleet.module';
import { ConfigModule } from '@nestjs/config';
import { ManagerModule } from './manager/manager.module';
import { LeasingsModule } from './leasings/leasings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    FleetModule,
    ManagerModule,
    LeasingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
