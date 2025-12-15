import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentRequest {
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
