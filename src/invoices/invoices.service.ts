import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import {} from 'src/data/dbUtils';
import { PrismaClientManager } from 'src/manager/manager.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly manager: PrismaClientManager) {}

  async create(tenantId: string, createInvoiceDto: CreateInvoiceDto) {
    try {
      const client = await this.manager.getClient(tenantId);
      const dedicatedLeasing = await client.leasing.findFirst({
        where: {
          id: createInvoiceDto.leasingId,
        },
        select: {
          id: true,
          allowedMileage: true,
          pickupDate: true,
          returnDate: true,
          Vehicle: {
            select: {
              VehicleClass: {
                select: {
                  pricePerHour: true,
                },
              },
            },
          },
        },
      });

      const result = await client.invoice.create({
        data: {
          leasingId: dedicatedLeasing.id,
          insuranceAmount: createInvoiceDto.insuranceAmount,
          amountDue: createInvoiceDto.amountDue,
        },
        select: {
          id: true,
          amountDue: true,
          insuranceAmount: true,
          leasingId: true,
          Payment: {
            select: {
              id: true,
            },
          },
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

      const result = await client.invoice.findMany({
        select: {
          id: true,
          amountDue: true,
          insuranceAmount: true,
          leasingId: true,
          Payment: {
            select: {
              id: true,
            },
          },
          Leasing: {
            select: {
              Customer: {
                select: {
                  firstName: true,
                  lastName: true,
                  User: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });

      console.log('sending: ', result);

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);

      return await client.invoice.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          amountDue: true,
          insuranceAmount: true,
          leasingId: true,
          Leasing: {
            select: {
              Customer: {
                select: {
                  firstName: true,
                  lastName: true,
                  User: {
                    select: {
                      email: true,
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
    updateInvoiceDto: UpdateInvoiceDto,
  ) {
    try {
      const client = await this.manager.getClient(tenantId);

      return await client.invoice.update({
        where: {
          id,
        },
        data: updateInvoiceDto,
        select: {
          id: true,
          amountDue: true,
          insuranceAmount: true,
          leasingId: true,
          Leasing: {
            select: {
              Customer: {
                select: {
                  firstName: true,
                  lastName: true,
                  User: {
                    select: {
                      email: true,
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

  async remove(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);

      return await client.invoice.delete({
        where: {
          id,
        },
      });
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
