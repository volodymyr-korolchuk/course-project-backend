import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Post('signin')
  signIn(@Body() authDto: AuthDto, @Req() req, @Res() res) {
    return this.authService.signIn(authDto, req, res);
  }

  @Get('logout')
  logOut() {
    return this.authService.logOut();
  }
}
