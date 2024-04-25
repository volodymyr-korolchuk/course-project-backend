import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import {
  ExtendedPrismaClient,
  PrismaClientManager,
} from 'src/manager/manager.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class FleetService {
  private client: ExtendedPrismaClient;

  constructor(private readonly manager: PrismaClientManager) {}

  private async switchClient(tenantId: string) {
    this.client = await this.manager.getClient(tenantId);
    console.log('client switched to:', this.client.clientName);
  }

  async create(tenantId: string, createVehicleDto: CreateVehicleDto) {
    try {
      await this.switchClient(tenantId);
      const existingVahicle = await this.client.fleet.findFirst({
        where: {
          vrm: createVehicleDto.vrm,
        },
      });

      const isValidClassId = await this.client.vehicleClass.findUnique({
        where: {
          id: createVehicleDto.classId,
        },
      });

      const isValidParkingLocationId =
        await this.client.parkingLocation.findUnique({
          where: {
            id: createVehicleDto.parkingLocationId,
          },
        });

      if (!isValidClassId) {
        throw new BadRequestException('Vehicle class does not exists.');
      }

      if (!isValidParkingLocationId) {
        throw new BadRequestException('Parking location does not exists.');
      }

      if (existingVahicle) {
        throw new BadRequestException('Vehicle with such vrm already exists.');
      }

      const result = await this.client.fleet.create({ data: createVehicleDto });

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
      const result = await this.client.fleet.findMany();

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
      const result = await this.client.fleet.findUnique({ where: { id } });

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
    updateVehicleDto: UpdateVehicleDto,
  ) {
    try {
      await this.switchClient(tenantId);
      const result = await this.client.fleet.update({
        where: {
          id,
        },
        data: updateVehicleDto,
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
      const result = await this.client.fleet.delete({ where: { id } });

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
