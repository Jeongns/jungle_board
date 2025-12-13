import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UsersService } from 'src/users/users.service';
import { ValidUserDto } from './dto/valid-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<ValidUserDto> {
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
  ): Promise<ValidUserDto | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === password) {
      return { id: user.id, username: user.username };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
