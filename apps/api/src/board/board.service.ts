import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardPageReponse } from './dto/get-board.dto';
import { Post, User } from 'generated/prisma/browser';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async getPaginatedPosts(search: string, page: number, limit: number) {
    const safeSearch = search ?? '';
    const safePage = Math.max(1, page ?? 1);
    const safeLimit = Math.max(1, limit ?? 10);
    const skip = (safePage - 1) * safeLimit;

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        select: {
          id: true,
          title: true,
          author: { select: { username: true } },
        },
        skip: skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
        where: { title: { contains: safeSearch } },
      }),
      this.prisma.post.count(),
    ]);

    return BoardPageReponse.paginatedPostsToDto(
      safePage,
      totalCount,
      safeLimit,
      items as (Post & { author: User })[],
    );
  }
}
