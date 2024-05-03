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
import {
  checkParkingLocationIdExists,
  checkVehicleClassIdExists,
  checkVehicleIdExists,
  checkVehicleVrmExists,
} from 'src/data/dbUtils';

@Injectable()
export class FleetService {
  constructor(private readonly manager: PrismaClientManager) {}

  async create(tenantId: string, createVehicleDto: CreateVehicleDto) {
    try {
      const client = await this.manager.getClient(tenantId);
      const vehicleVrmExists = await checkVehicleVrmExists(
        client,
        createVehicleDto.vrm,
      );

      if (vehicleVrmExists) {
        throw new BadRequestException('Vehicle with such vrm already exists.');
      }

      const vehicleClassIdExists = await checkVehicleClassIdExists(
        client,
        createVehicleDto.classId,
      );

      if (!vehicleClassIdExists) {
        throw new BadRequestException('Vehicle class does not exist.');
      }

      const parkingLocationIdExists = await checkParkingLocationIdExists(
        client,
        createVehicleDto.parkingLocationId,
      );

      if (!parkingLocationIdExists) {
        throw new BadRequestException('Parking location does not exist.');
      }

      const result = await client.fleet.create({ data: createVehicleDto });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);
      const result = await client.fleet.findMany({
        include: {
          VehicleClass: {
            select: {
              title: true,
              pricePerHour: true,
            },
          },
          ParkingLocation: {
            select: {
              address: true,
            },
          },
        },
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);
      return await client.fleet.findUnique({
        where: { id },
        include: {
          VehicleClass: {
            select: {
              title: true,
              pricePerHour: true,
            },
          },
          ParkingLocation: {
            select: {
              address: true,
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
    updateVehicleDto: UpdateVehicleDto,
  ) {
    try {
      const client = await this.manager.getClient(tenantId);

      if (updateVehicleDto?.vrm) {
        const vehicleVrmExists = await checkVehicleVrmExists(
          client,
          updateVehicleDto.vrm,
        );

        if (vehicleVrmExists) {
          throw new BadRequestException(
            'Vehicle with such vrm already exists.',
          );
        }
      }

      if (updateVehicleDto?.classId) {
        const vehicleClassIdExists = await checkVehicleClassIdExists(
          client,
          updateVehicleDto.classId,
        );

        if (!vehicleClassIdExists) {
          throw new BadRequestException('Vehicle class does not exist.');
        }
      }

      if (updateVehicleDto?.parkingLocationId) {
        const parkingLocationIdExists = await checkParkingLocationIdExists(
          client,
          updateVehicleDto.parkingLocationId,
        );

        if (!parkingLocationIdExists) {
          throw new BadRequestException('Employee does not exist.');
        }
      }

      const result = await client.fleet.update({
        where: {
          id,
        },
        data: updateVehicleDto,
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(tenantId: string, id: number) {
    try {
      // before deleting any car, make sure that all leasings that
      // have it`s id as vehicleId are deleted
      const client = await this.manager.getClient(tenantId);

      const vehicleIdExists = await checkVehicleIdExists(client, id);
      if (!vehicleIdExists) {
        throw new BadRequestException('Vehicle does not exist.');
      }

      await client.fleet.delete({ where: { id } });
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
