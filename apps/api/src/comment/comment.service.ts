import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCommentRequest } from './dto/create-comment.dto';
import { UpdateCommentRequest } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from 'generated/prisma/browser';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  createComment(
    userId: number,
    createCommentRequest: CreateCommentRequest,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        postId: createCommentRequest.postId,
        userId: userId,
        content: createCommentRequest.content,
      },
    });
  }

  getComment(id: number): Promise<Comment> {
    return this.prisma.comment.findUniqueOrThrow({ where: { id } });
  }

  async getCommentsByPostId(
    postId: number,
  ): Promise<(Comment & { User: { username: string } })[]> {
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
    updateCommentRequest: UpdateCommentRequest,
  ): Promise<Comment> {
    const comment = await this.getComment(id);
    if (comment.id != userId) {
      throw new ForbiddenException('You are not the author of this comment');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content: updateCommentRequest.content },
    });
  }

  async removeComment(id: number, userId: number): Promise<Comment> {
    const comment = await this.getComment(id);
    if (comment.id != userId) {
      throw new ForbiddenException('You are not the author of this comment');
    }

    return this.prisma.comment.delete({ where: { id } });
  }
}
