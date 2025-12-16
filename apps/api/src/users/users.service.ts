import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  createUser(email: string, username: string, password: string): Promise<User> {
    return this.prisma.user.create({
      data: { email: email, username: username, password: password },
    });
  }
}
