import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { async } from 'rxjs';
import {
  ExtendedPrismaClient,
  PrismaClientManager,
} from 'src/manager/manager.service';

@Injectable()
export class CustomersService {
  constructor(private readonly manager: PrismaClientManager) {}

  async create(tenantId: string, createCustomerDto: CreateCustomerDto) {
    try {
      const client = await this.manager.getClient(tenantId);
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        throw new ForbiddenException(
          'You don`t have a permissions to perform such action.',
        );
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);
      return await client.customer.findMany();
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        throw new ForbiddenException(
          'You don`t have a permissions to perform such action.',
        );
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);
      return await client.customer.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        throw new ForbiddenException(
          'You don`t have a permissions to perform such action.',
        );
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    tenantId: string,
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      const client = await this.manager.getClient(tenantId);
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        throw new ForbiddenException(
          'You don`t have a permissions to perform such action.',
        );
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);
    } catch (error) {
      if (error instanceof PrismaClientUnknownRequestError) {
        throw new ForbiddenException(
          'You don`t have a permissions to perform such action.',
        );
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
