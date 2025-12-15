import { IsNumber, IsOptional } from 'class-validator';
import { Post, User } from 'generated/prisma/browser';
import { Pagination } from 'src/common/types/pagination';

export class BoardPageReqeust {
  @IsOptional()
  search: string = '';

  @IsNumber()
  page: number = 1;

  @IsNumber()
  limit: number = 10;
}

export class BoardPageReponse implements Pagination<PageInfo> {
  static paginatedPostsToDto(
    page: number,
    totalCount: number,
    limit: number,
    posts: (Post & { author: User })[],
  ) {
    return new Pagination<PageInfo>(
      page,
      totalCount,
      limit,
      posts.map(
        (item) => new PageInfo(item.id, item.title, item.author.username),
      ),
    );
  }
  page: number;
  totalCount: number;
  limit: number;
  items: PageInfo[];
}

class PageInfo {
  constructor(
    public id: number,
    public title: string,
    public username: string,
  ) {}
}
