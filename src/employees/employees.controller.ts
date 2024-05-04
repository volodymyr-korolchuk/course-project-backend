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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DB_ROLES } from 'src/constants';
import { TenantId } from 'src/common/decorators/tenand-id.decorator';

@Controller('employees')
@UseGuards(JwtGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles([])
  create(
    @TenantId() tenantId: string,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Roles([DB_ROLES.Customer, DB_ROLES.Employee])
  findAll(@TenantId() tenantId: string) {
    return this.employeesService.findAll(tenantId);
  }

  @Get('analytics')
  @Roles([DB_ROLES.Employee])
  getAnalytics(@TenantId() tenantId: string) {
    return this.employeesService.getAnalytics(tenantId);
  }

  @Get(':id')
  @Roles([DB_ROLES.Customer, DB_ROLES.Employee])
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeesService.findOne(tenantId, +id);
  }

  @Patch(':id')
  @Roles([])
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles([])
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.employeesService.remove(tenantId, +id);
  }
}
