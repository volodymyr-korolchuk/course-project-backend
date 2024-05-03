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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { DB_ROLES } from 'src/constants';
import { TenantId } from 'src/common/decorators/tenand-id.decorator';

@Controller('payments')
@UseGuards(JwtGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles([DB_ROLES.Customer, DB_ROLES.Employee])
  create(
    @TenantId() tenantId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(tenantId, createPaymentDto);
  }

  @Get()
  @Roles([DB_ROLES.Employee])
  findAll(@TenantId() tenantId: string) {
    return this.paymentsService.findAll(tenantId);
  }

  @Get(':id')
  @Roles([DB_ROLES.Employee])
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.paymentsService.findOne(tenantId, +id);
  }

  @Patch(':id')
  @Roles([DB_ROLES.Employee])
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(tenantId, +id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles([DB_ROLES.Employee])
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.paymentsService.remove(tenantId, +id);
  }
}
