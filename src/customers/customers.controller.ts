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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { TenantId } from 'src/common/decorators/tenand-id.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DB_ROLES } from 'src/constants';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('customers')
@UseGuards(JwtGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles([DB_ROLES.Employee, DB_ROLES.Customer])
  findAll(@TenantId() tenantId: string) {
    return this.customersService.findAll(tenantId);
  }

  @Get(':id')
  @Roles([DB_ROLES.Employee])
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.customersService.findOne(tenantId, +id);
  }

  @Patch(':id')
  @Roles([DB_ROLES.Employee])
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(tenantId, +id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles([DB_ROLES.Employee])
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.customersService.remove(tenantId, +id);
  }
}
