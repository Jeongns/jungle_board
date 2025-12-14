import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { User } from './decorators/user.decorator';
import type { AuthenticatedUser } from 'src/common/types/authenticated-user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: AuthenticatedUser) {
    return this.authService.login(user);
  }

  @Get('profile')
  getProfile(@User() user: AuthenticatedUser) {
    return user;
  }
}
