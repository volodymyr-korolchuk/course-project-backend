import { Injectable } from '@nestjs/common';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import {
  ExtendedPrismaClient,
  PrismaClientManager,
} from 'src/manager/manager.service';

@Injectable()
export class FleetService {
  private client: ExtendedPrismaClient;

  constructor(private readonly manager: PrismaClientManager) {
    const setupClient = async () => {
      // tenantId should be extracted from nest asyncLocalStorage
      this.client = await this.manager.getClient('Admin');
      await this.client.$connect();
      console.log(
        'Fleet: ',
        this.client.clientName,
        this.client.connectionString,
      );
    };

    setupClient();
  }

  async create(createVehicleDto: CreateVehicleDto) {
    return await this.client.fleet.create({ data: createVehicleDto });
  }

  async findAll() {
    return await this.client.fleet.findMany();
  }

  async findOne(id: number) {
    return await this.client.fleet.findUnique({ where: { id } });
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} fleet`;
  }

  remove(id: number) {
    return `This action removes a #${id} fleet`;
  }
}
