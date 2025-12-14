import { Post } from 'generated/prisma/client';

export class FindPostResponse {
  constructor(UserId: number, post: Post) {
    this.isMine = post.authorId === UserId;
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.authorId = post.authorId;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
  isMine: boolean;
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}
