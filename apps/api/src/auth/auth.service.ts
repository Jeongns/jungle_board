import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedUser } from 'src/common/types/authenticated-user';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    const duplicateUser = await this.usersService.findOneByEmail(email);

    if (duplicateUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return this.usersService.createUser(email, username, hash);
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

  getJwtToken(user: AuthenticatedUser) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
