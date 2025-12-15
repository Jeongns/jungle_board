import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentRequest } from './create-comment.dto';

export class UpdateCommentRequest extends PartialType(CreateCommentRequest) {}
