import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  ExtendedPrismaClient,
  PrismaClientManager,
} from 'src/manager/manager.service';
import { DB_ROLES, DB_ROLES_ID } from 'src/constants';
import { LoginDto } from './dto/login.dto';
import {
  getCustomerByUserId,
  getEmployeeByUserId,
  getRoleTitleById,
  getUserByEmail,
} from 'src/data/dbUtils';
import { RefreshDto } from './dto/refresh.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private client: ExtendedPrismaClient = null;

  constructor(
    private readonly jwtService: JwtService,
    private readonly manager: PrismaClientManager,
  ) {
    const setupClient = async () => {
      this.client = await this.manager.getClient(DB_ROLES.Guest);
    };

    setupClient();
  }

  async validateUser(authDto: LoginDto) {
    const userRaw = await this.getUserRaw(authDto);
    await this.comparePasswords(authDto.password, userRaw.hashedPassword);

    const user = {
      ...(await this.getAccount(userRaw)),
      role: await getRoleTitleById(this.client, userRaw.roleId),
    };

    const accessToken = await this.jwtService.sign(user);
    const refreshToken = await this.jwtService.sign(user, { expiresIn: '7d' });
    console.log('this: ', { user, accessToken, refreshToken });

    return { user, accessToken, refreshToken };
  }

  async refresh(refreshDto: RefreshDto) {
    const { iat, exp, ...user } = refreshDto;
    const accessToken = await this.jwtService.sign(user);

    return { user, accessToken };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.client.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with such email already exists.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    await this.client.user.create({
      data: {
        email: registerDto.email,
        roleId: DB_ROLES_ID.Customer,
        hashedPassword: hashedPassword,
        Customer: {
          create: {
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            phoneNumber: registerDto.phoneNumber,
          },
        },
      },
    });
  }

  private async comparePasswords(data: string, hash: string) {
    const match = await bcrypt.compare(data, hash);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  private async getUserRaw(authDto: LoginDto) {
    const user = await getUserByEmail(this.client, authDto.email);
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }
    return user;
  }

  private async getAccount(user) {
    const customer = await getCustomerByUserId(this.client, user.id);
    const employee = await getEmployeeByUserId(this.client, user.id);

    const { id, firstName, lastName } = customer || employee;
    return { id, firstName, lastName, email: user.email };
  }
}
