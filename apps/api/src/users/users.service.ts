import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/browser';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserRequest } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  createUser(createUserRequest: CreateUserRequest): Promise<User> {
    return this.prisma.user.create({ data: createUserRequest });
  }
}
