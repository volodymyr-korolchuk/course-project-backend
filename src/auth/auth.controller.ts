import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from '../common/guards/local.guard';
import { JwtGuard } from '../common/guards/jwt.guard';
import { Request } from 'express';
import { RefreshJwtGuard } from 'src/common/guards/refresh-jwt.guard';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return req.user;
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  refresh(@Req() req: Request) {
    return this.authService.refresh(req.user as RefreshDto);
  }

  @Get('status')
  @UseGuards(JwtGuard)
  status(@Req() req: Request) {
    console.log(req.user);
  }
}
