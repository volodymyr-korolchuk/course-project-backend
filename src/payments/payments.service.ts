import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaClientManager } from 'src/manager/manager.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentsService {
  constructor(private readonly manager: PrismaClientManager) {}

  async create(tenantId: string, createPaymentDto: CreatePaymentDto) {
    try {
      const client = await this.manager.getClient(tenantId);
      const dedicatedInvoice = await client.invoice.findFirst({
        where: {
          id: createPaymentDto.invoiceId,
        },
        select: {
          id: true,
          amountDue: true,
          insuranceAmount: true,
        },
      });

      const result = await client.payment.create({
        data: {
          invoiceId: dedicatedInvoice.id,
          createdOn: new Date(),
          totalAmount:
            Number(dedicatedInvoice.amountDue) +
            Number(dedicatedInvoice.insuranceAmount),
        },
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);

      return await client.payment.findMany({
        select: {
          id: true,
          createdOn: true,
          invoiceId: true,
          totalAmount: true,
          Invoice: {
            select: {
              Leasing: {
                select: {
                  id: true,
                  Customer: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);

      return await client.payment.findMany({
        where: {
          id,
        },
        select: {
          id: true,
          createdOn: true,
          invoiceId: true,
          totalAmount: true,
          Invoice: {
            select: {
              Leasing: {
                select: {
                  Customer: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
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

  async update(
    tenantId: string,
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    return `This action updates a #${id} payment`;
  }

  async remove(tenantId: string, id: number) {
    return `This action removes a #${id} payment`;
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
