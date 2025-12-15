import { IsNumber, IsOptional } from 'class-validator';
import { Post, User } from 'generated/prisma/browser';

export class BoardPageReqeust {
  @IsOptional()
  search: string = '';

  @IsNumber()
  page: number = 1;

  @IsNumber()
  limit: number = 10;
}

export class BoardPageReponse {
  constructor(
    page: number,
    totalCount: number,
    limit: number,
    items: (Post & { author: User })[],
  ) {
    this.page = page;
    this.totalCount = totalCount;
    this.limit = limit;
    items.map((item) =>
      this.items.push(new PageInfo(item.id, item.title, item.author.username)),
    );
  }
  page: number;
  items: PageInfo[];
  totalCount: number;
  limit: number;
}

class PageInfo {
  constructor(
    public id: number,
    public title: string,
    public username: string,
  ) {}
}
