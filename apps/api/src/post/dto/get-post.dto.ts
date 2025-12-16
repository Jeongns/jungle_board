import { Post } from 'generated/prisma/client';

export class GetPostResponse {
  static postToDto(userId: number, post: Post) {
    return new GetPostResponse(
      userId == post.authorId,
      post.id,
      post.title,
      post.content,
      post.authorId,
      post.createdAt,
      post.updatedAt,
    );
  }
  constructor(
    public isMine: boolean,
    public id: number,
    public title: string,
    public content: string,
    public authorId: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
