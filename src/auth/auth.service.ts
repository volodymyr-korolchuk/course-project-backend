import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  ExtendedPrismaClient,
  PrismaClientManager,
} from 'src/manager/manager.service';

@Injectable()
export class AuthService {
  private client: ExtendedPrismaClient;

  constructor(
    private readonly jwtService: JwtService,
    private readonly manager: PrismaClientManager,
  ) {
    const setupClient = async () => {
      this.client = await this.manager.getClient('guest');

      await this.client.$connect();
      console.log(
        'Auth: ',
        this.client.clientName,
        this.client.connectionString,
      );
    };

    setupClient();
  }

  async validateUser(authDto: AuthDto) {
    const existingUser = await this.client.user.findUnique({
      where: { email: authDto.email },
    });

    if (!existingUser) {
      return null;
    }

    const passwordsMatch = bcrypt.compare(
      authDto.password,
      existingUser.hashedPassword,
    );

    if (!passwordsMatch) {
      return null;
    }

    const userRole = await this.client.role.findUnique({
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
    const existingUser = await this.client.user.findUnique({
      where: { email: authDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with such email already exists.');
    }

    const hashedPassword = await bcrypt.hash(authDto.password, 10);

    await this.client.user.create({
      data: {
        email: authDto.email,
        roleId: 1,
        hashedPassword: hashedPassword,
      },
    });
  }
}
