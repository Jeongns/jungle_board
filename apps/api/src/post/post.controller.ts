import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostRequest } from './dto/create-post.dto';
import { UpdatePostRequest } from './dto/update-post.dto';
import { User } from 'src/auth/decorators/user.decorator';
import type { AuthenticatedUser } from 'src/common/types/authenticated-user';
import { GetPostResponse } from './dto/get-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(
    @User() user: AuthenticatedUser,
    @Body() createPostRequest: CreatePostRequest,
  ) {
    return this.postService.createPost(
      user.id,
      createPostRequest.title,
      createPostRequest.content,
    );
  }

  @Get(':id')
  async getPostDetail(
    @User() user: AuthenticatedUser,
    @Param('id') id: number,
  ) {
    const post = await this.postService.getPost(id);
    return GetPostResponse.postToDto(user.id, post);
  }

  @Patch(':id')
  update(
    @User() user: AuthenticatedUser,
    @Param('id') id: number,
    @Body() updatePostRequest: UpdatePostRequest,
  ) {
    return this.postService.updatePost(
      id,
      user.id,
      updatePostRequest.title,
      updatePostRequest.content,
    );
  }

  @Delete(':id')
  remove(@User() user: AuthenticatedUser, @Param('id') id: number) {
    return this.postService.removePost(id, user.id);
  }
}
