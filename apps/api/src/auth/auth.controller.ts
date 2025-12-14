import { Controller, Post, UseGuards, Get, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { User } from './decorators/user.decorator';
import type { AuthenticatedUser } from 'src/common/types/authenticated-user';
import { CreateUserRequest } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserRequest: CreateUserRequest) {
    this.logger.log(`Registering user with email: ${createUserRequest.email}`);
    return this.authService.register(createUserRequest);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: AuthenticatedUser) {
    this.logger.log(`Logging in user with id: ${user.id}`);
    return this.authService.login(user);
  }

  @Get('profile')
  getProfile(@User() user: AuthenticatedUser) {
    return user;
  }
}
