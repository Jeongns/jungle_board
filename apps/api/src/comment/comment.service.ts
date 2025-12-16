import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from 'generated/prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  createComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        postId: postId,
        userId: userId,
        content: content,
      },
    });
  }

  getComment(id: number): Promise<Comment> {
    return this.prisma.comment.findUniqueOrThrow({ where: { id } });
  }

  async getCommentsByPostId(postId: number) {
    const post = await this.prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      select: {
        comments: { include: { User: { select: { username: true } } } },
      },
    });
    return post.comments;
  }

  async updateComment(
    id: number,
    userId: number,
    content: string,
  ): Promise<Comment> {
    const comment = await this.getComment(id);
    if (comment.userId != userId) {
      throw new ForbiddenException('You are not the author of this comment');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content: content },
    });
  }

  async removeComment(id: number, userId: number): Promise<Comment> {
    const comment = await this.getComment(id);
    if (comment.userId != userId) {
      throw new ForbiddenException('You are not the author of this comment');
    }

    return this.prisma.comment.delete({ where: { id } });
  }
}
