import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

  async signIn(authDto: AuthDto, req: Request, res: Response) {
    const { email, password } = authDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new BadRequestException('User with such email does not exists.');
    }

    const passwordsMatch = await this.comparePasswords({
      password,
      hash: existingUser.hashedPassword,
    });

    if (!passwordsMatch) {
      throw new BadRequestException('Invalid credentials.');
    }

    const token = await this.signToken({
      id: existingUser.id,
      email: existingUser.email,
    });

    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('authorization', token);

    return res.send({
      message: 'Logged in successfully.',
    });
  }

  async logOut(req: Request, res: Response) {
    res.clearCookie('authorization');
    return res.send({ message: 'Logged out successfully.' });
  }

  async hashData(data: string) {
    const saltRounds = 10;
    return await bcrypt.hash(data, saltRounds);
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: string; email: string }) {
    const payload = args;

    return this.jwtService.signAsync(payload, { secret: JWT_SECRET });
  }
}
