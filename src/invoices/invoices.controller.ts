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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { DB_ROLES } from 'src/constants';
import { TenantId } from 'src/common/decorators/tenand-id.decorator';

@Controller('invoices')
@UseGuards(JwtGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles([DB_ROLES.Customer, DB_ROLES.Employee])
  create(
    @TenantId() tenantId: string,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(tenantId, createInvoiceDto);
  }

  @Get()
  @Roles([DB_ROLES.Employee])
  findAll(@TenantId() tenantId: string) {
    return this.invoicesService.findAll(tenantId);
  }

  @Get(':id')
  @Roles([DB_ROLES.Customer, DB_ROLES.Employee])
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.invoicesService.findOne(tenantId, +id);
  }

  @Patch(':id')
  @Roles([DB_ROLES.Employee])
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(tenantId, +id, updateInvoiceDto);
  }

  @Delete(':id')
  @Roles([DB_ROLES.Employee])
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.invoicesService.remove(tenantId, +id);
  }
}
