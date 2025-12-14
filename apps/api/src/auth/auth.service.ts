import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UsersService } from 'src/users/users.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<AuthUserDto> {
    const duplicateUser = await this.usersService.findOneByEmail(userDto.email);
    if (duplicateUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.usersService.createUser(userDto);
    return { id: user.id, username: user.username };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUserDto | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === password) {
      return { id: user.id, username: user.username };
    }
    return null;
  }

  login(user: AuthUserDto) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
