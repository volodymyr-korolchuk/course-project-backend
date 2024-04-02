import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(authDto: AuthDto) {
    const { email, password } = authDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with such email already exists.');
    }

    const hashedPassword = await this.hashData(password);

    await this.prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  }

  async signIn() {
    return 'success';
  }

  async logOut() {
    return 'success';
  }

  async hashData(data: string) {
    const saltRounds = 10;
    return await bcrypt.hash(data, saltRounds);
  }
}
