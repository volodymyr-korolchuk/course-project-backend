import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaClientManager } from 'src/manager/manager.service';
import { checkEmployeeIdExists, checkUserIdExists } from 'src/data/dbUtils';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class EmployeesService {
  constructor(private readonly manager: PrismaClientManager) {}

  async create(createEmployeeDto: CreateEmployeeDto) {}

  async findAll(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);
      return await client.staff.findMany();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);
      return await client.staff.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  async remove(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);

      const employeeExists = await checkEmployeeIdExists(client, id);

      if (!employeeExists) {
        throw new BadRequestException('Employee does not exist.');
      }

      await client.staff.delete({ where: { id } });
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof PrismaClientUnknownRequestError) {
      console.error(error.message);

      throw new ForbiddenException(
        'You don`t have permissions to perform such action.',
      );
    }
    throw new InternalServerErrorException(error.message);
  }
}
