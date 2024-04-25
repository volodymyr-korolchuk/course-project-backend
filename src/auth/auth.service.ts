import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientManager } from 'src/manager/manager.service';
import { DB_ROLES, DB_ROLES_ID } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly manager: PrismaClientManager,
  ) {}

  async validateUser(authDto: AuthDto) {
    const client = await this.manager.getClient(DB_ROLES.Guest);

    const existingUser = await client.user.findUnique({
      where: { email: authDto.email },
    });

    if (!existingUser) {
      throw new NotFoundException('User does not exist.');
    }

    const passwordsMatch = bcrypt.compare(
      authDto.password,
      existingUser.hashedPassword,
    );

    if (!passwordsMatch) {
      return null;
    }

    const userRole = await client.role.findUnique({
      where: { id: existingUser.roleId },
      select: {
        title: true,
      },
    });
    const { hashedPassword, roleId, ...user } = existingUser;

    return await this.jwtService.sign({
      ...user,
      role: userRole.title,
    });
  }

  async register(authDto: AuthDto) {
    const client = await this.manager.getClient(DB_ROLES.Guest);

    const existingUser = await client.user.findUnique({
      where: { email: authDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with such email already exists.');
    }

    const hashedPassword = await bcrypt.hash(authDto.password, 10);

    await client.user.create({
      data: {
        email: authDto.email,
        roleId: DB_ROLES_ID.Customer,
        hashedPassword: hashedPassword,
      },
    });
  }
}
