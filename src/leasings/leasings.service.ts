import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLeasingDto } from './dto/create-leasing.dto';
import { UpdateLeasingDto } from './dto/update-leasing.dto';
import {
  ExtendedPrismaClient,
  PrismaClientManager,
} from 'src/manager/manager.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class LeasingsService {
  private client: ExtendedPrismaClient;

  constructor(private readonly manager: PrismaClientManager) {}

  private async switchClient(tenantId: string) {
    this.client = await this.manager.getClient(tenantId);
    console.log('client switched to:', this.client.clientName);
  }

  async create(tenantId: string, createLeasingDto: CreateLeasingDto) {
    try {
      await this.switchClient(tenantId);
      const result = await this.client.leasing.create({
        data: createLeasingDto,
      });

      return result;
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
      await this.switchClient(tenantId);
      const result = await this.client.leasing.findMany();

      return result;
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
      await this.switchClient(tenantId);
      const result = await this.client.leasing.findUnique({
        where: {
          id,
        },
      });

      return result;
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
    updateLeasingDto: UpdateLeasingDto,
  ) {
    try {
      await this.switchClient(tenantId);
      const result = await this.client.leasing.update({
        where: {
          id,
        },
        data: updateLeasingDto,
      });

      return result;
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
      await this.switchClient(tenantId);
      const result = await this.client.leasing.delete({ where: { id } });

      return result;
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
