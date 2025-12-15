export class Pagination<T> {
  constructor(
    public page: number,
    public totalCount: number,
    public limit: number,
    public items: T[],
  ) {}
}
