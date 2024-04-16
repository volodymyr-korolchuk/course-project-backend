import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(authDto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
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

    const { hashedPassword, ...user } = existingUser;

    return await this.jwtService.sign(user);
  }

  async register(authDto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with such email already exists.');
    }

    const hashedPassword = await bcrypt.hash(authDto.password, 10);

    await this.prisma.user.create({
      data: {
        email: authDto.email,
        roleId: 1,
        hashedPassword: hashedPassword,
      },
    });
  }
}
