import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from 'generated/prisma/browser';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  createPost(userId: number, title: string, content: string): Promise<Post> {
    return this.prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: userId,
      },
    });
  }

  async getPost(id: number): Promise<Post> {
    const post = await this.prisma.post.findUniqueOrThrow({
      where: { id },
    });
    return post;
  }

  async updatePost(
    id: number,
    userId: number,
    title: string,
    content: string,
  ): Promise<Post> {
    const post = await this.getPost(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        title: title,
        content: content,
      },
    });
  }

  async removePost(id: number, userId: number): Promise<Post> {
    const post = await this.getPost(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }

    return this.prisma.post.delete({ where: { id } });
  }
}
