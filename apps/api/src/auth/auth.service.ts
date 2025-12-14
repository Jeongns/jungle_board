import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserRequest } from 'src/users/dto/create-user.dto';
import { AuthenticatedUser } from 'src/common/types/authenticated-user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserRequest): Promise<AuthenticatedUser> {
    const duplicateUser = await this.usersService.findOneByEmail(userDto.email);
    if (duplicateUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userDto.password, salt);
    userDto.password = hash;

    const user = await this.usersService.createUser(userDto);
    return { id: user.id, username: user.username };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, username: user.username };
    }
    return null;
  }

  login(user: AuthenticatedUser) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
