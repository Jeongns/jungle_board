import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Post, User } from 'generated/prisma/client';
import { Pagination } from 'src/common/types/pagination';

export class BoardPageReqeust {
  @IsOptional()
  search: string = '';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
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
        (item) =>
          new PageInfo(
            item.id,
            item.title,
            item.author.username,
            item.createdAt,
          ),
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
    public createdAt: Date,
  ) {}
}
