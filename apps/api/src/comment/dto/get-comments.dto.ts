import { Comment } from 'generated/prisma/client';

export class PostCommentsResponse {
  constructor(datas: (Comment & { User: { username: string } })[]) {
    this.comments = datas.map(
      (data) =>
        new PostComment(
          data.id,
          data.User.username,
          data.content,
          data.postId,
          data.userId,
          data.createdAt,
          data.updatedAt,
        ),
    );
  }
  comments: PostComment[];
}

class PostComment {
  constructor(
    public id: number,
    public username: string,
    public content: string,
    public postId: number,
    public userId: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
