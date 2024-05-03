import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FleetModule } from './fleet/fleet.module';
import { ConfigModule } from '@nestjs/config';
import { ManagerModule } from './manager/manager.module';
import { LeasingsModule } from './leasings/leasings.module';
import { CustomersModule } from './customers/customers.module';
import { EmployeesModule } from './employees/employees.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    FleetModule,
    ManagerModule,
    LeasingsModule,
    CustomersModule,
    EmployeesModule,
    InvoicesModule,
    PaymentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
