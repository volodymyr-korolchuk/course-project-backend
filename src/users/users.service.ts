import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientManager } from 'src/manager/manager.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { DB_ROLES, DB_ROLES_ID } from 'src/constants';

@Injectable()
export class UsersService {
  constructor(private readonly manager: PrismaClientManager) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findStaff(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);

      return await client.user.findMany({
        where: {
          roleId: {
            in: [DB_ROLES_ID.Employee],
          },
        },
      });
    } catch (error) {}
  }

  async getCustomerId(tenantId: string, id: string) {
    try {
      const client = await this.manager.getClient(tenantId);
      return await client.user.findUnique({
        where: {
          id: +id,
        },
        select: {
          Customer: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {}
  }

  async update(tenantId: string, id: number, updateUserDto: UpdateUserDto) {
    try {
      const client = await this.manager.getClient(tenantId);

      return await client.user.update({
        where: {
          id,
        },
        data: {
          roleId: updateUserDto.roleId,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
