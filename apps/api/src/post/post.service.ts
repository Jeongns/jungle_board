import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostRequest } from './dto/create-post.dto';
import { UpdatePostRequest } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from 'generated/prisma/browser';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  createPost(
    userId: number,
    createPostRequest: CreatePostRequest,
  ): Promise<Post> {
    return this.prisma.post.create({
      data: {
        title: createPostRequest.title,
        content: createPostRequest.content,
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
    updatePostRequest: UpdatePostRequest,
  ): Promise<Post> {
    const post = await this.getPost(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        title: updatePostRequest.title,
        content: updatePostRequest.content,
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
