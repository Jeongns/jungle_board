import { PartialType } from '@nestjs/mapped-types';
import { CreatePostRequest } from './create-post.dto';

export class UpdatePostRequest extends PartialType(CreatePostRequest) {}
