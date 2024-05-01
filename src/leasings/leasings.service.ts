import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLeasingDto } from './dto/create-leasing.dto';
import { UpdateLeasingDto } from './dto/update-leasing.dto';
import { PrismaClientManager } from 'src/manager/manager.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import {
  checkCustomerIdExists,
  checkEmployeeIdExists,
  checkLeasingIdExists,
  checkVehicleIdExists,
} from 'src/data/dbUtils';

@Injectable()
export class LeasingsService {
  constructor(private readonly manager: PrismaClientManager) {}

  async create(tenantId: string, createLeasingDto: CreateLeasingDto) {
    try {
      const client = await this.manager.getClient(tenantId);

      const vehicleExists = await checkVehicleIdExists(
        client,
        createLeasingDto.vehicleId,
      );

      if (!vehicleExists) {
        throw new BadRequestException('Vehicle does not exist.');
      }

      const employeeExists = await checkEmployeeIdExists(
        client,
        createLeasingDto.createdByEmployeeId,
      );

      if (!employeeExists) {
        throw new BadRequestException('Employee does not exist.');
      }

      const customerExists = await checkCustomerIdExists(
        client,
        createLeasingDto.customerId,
      );

      if (!customerExists) {
        throw new BadRequestException('Customer does not exist.');
      }

      // forbid to put invalid dates on frontend. anyway, compare dates here.

      const result = await client.leasing.create({
        data: createLeasingDto,
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);

      const result = await client.leasing.findMany();

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);

      return await client.leasing.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    tenantId: string,
    id: number,
    updateLeasingDto: UpdateLeasingDto,
  ) {
    try {
      const client = await this.manager.getClient(tenantId);

      if (updateLeasingDto?.vehicleId) {
        const vehicleExists = await checkVehicleIdExists(
          client,
          updateLeasingDto.vehicleId,
        );

        if (!vehicleExists) {
          throw new BadRequestException('Vehicle does not exist.');
        }
      }

      if (updateLeasingDto?.createdByEmployeeId) {
        const employeeExists = await checkEmployeeIdExists(
          client,
          updateLeasingDto.createdByEmployeeId,
        );

        if (!employeeExists) {
          throw new BadRequestException('Employee does not exist.');
        }
      }

      if (updateLeasingDto?.customerId) {
        const customerExists = await checkCustomerIdExists(
          client,
          updateLeasingDto.customerId,
        );

        if (!customerExists) {
          throw new BadRequestException('Customer does not exist.');
        }
      }

      // also check dates here

      const result = await client.leasing.update({
        where: {
          id,
        },
        data: updateLeasingDto,
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);

      const leasingExists = await checkLeasingIdExists(client, id);
      if (!leasingExists) {
        throw new BadRequestException('Leasing does not exist.');
      }

      const result = await client.leasing.delete({ where: { id } });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof PrismaClientUnknownRequestError) {
      throw new ForbiddenException(
        'You don`t have permissions to perform such action.',
      );
    }
    throw new InternalServerErrorException(error.message);
  }
}
