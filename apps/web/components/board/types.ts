export type Post = {
  id: string;
  title: string;
  author?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isMine?: boolean;
};

export type PostListItem = {
  id: number | string;
  title: string;
  author: string;
  createdAt: string;
};
