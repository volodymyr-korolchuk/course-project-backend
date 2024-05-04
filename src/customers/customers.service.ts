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

  async findAll(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);
      return await client.customer.findMany();
    } catch (error) {
      this.handleError(error);
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
      this.handleError(error);
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
      this.handleError(error);
    }
  }

  async remove(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findPayments(tenantId: string, id) {
    try {
      const client = await this.manager.getClient(tenantId);
      await client.invoice.findMany({
        where: {
          Leasing: {
            customerId: id,
          },
        },
        select: {
          amountDue: true,
          insuranceAmount: true,
          Payment: {
            select: {
              id: true,
            },
          },
          Leasing: {
            select: {
              Vehicle: {
                select: {
                  make: true,
                  model: true,
                  color: true,
                },
              },
            },
          },
        },
      });
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
