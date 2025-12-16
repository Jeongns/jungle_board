import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Logger,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { User } from './decorators/user.decorator';
import type { AuthenticatedUser } from 'src/common/types/authenticated-user';
import { RegistUserRequest } from './dto/regist-user.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registUserRequest: RegistUserRequest) {
    this.logger.log(`Registering user with email: ${registUserRequest.email}`);

    return this.authService.register(
      registUserRequest.email,
      registUserRequest.username,
      registUserRequest.password,
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Res() res: Response, @User() user: AuthenticatedUser) {
    this.logger.log(`Logging in user with id: ${user.id}`);
    const token = this.authService.getJwtToken(user);
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60, // 1h
    });
  }

  @Get('profile')
  getProfile(@User() user: AuthenticatedUser) {
    return user;
  }
}
