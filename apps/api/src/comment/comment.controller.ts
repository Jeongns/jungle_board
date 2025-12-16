import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentRequest } from './dto/create-comment.dto';
import { UpdateCommentRequest } from './dto/update-comment.dto';
import { User } from 'src/auth/decorators/user.decorator';
import type { AuthenticatedUser } from 'src/common/types/authenticated-user';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @User() user: AuthenticatedUser,
    @Body() createCommentRequest: CreateCommentRequest,
  ) {
    return this.commentService.createComment(
      user.id,
      createCommentRequest.postId,
      createCommentRequest.content,
    );
  }

  @Get(':id')
  getComments(@Param('id') id: number) {
    return this.commentService.getCommentsByPostId(id);
  }

  @Patch(':id')
  update(
    @User() user: AuthenticatedUser,
    @Param('id') id: number,
    @Body() updateCommentRequest: UpdateCommentRequest,
  ) {
    return this.commentService.updateComment(
      id,
      user.id,
      updateCommentRequest.content,
    );
  }

  @Delete(':id')
  remove(@User() user: AuthenticatedUser, @Param('id') id: number) {
    return this.commentService.removeComment(id, user.id);
  }
}
