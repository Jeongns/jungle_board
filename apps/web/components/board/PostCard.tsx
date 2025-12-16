import Link from "next/link";

import type { PostListItem } from "@/components/board/types";

function formatDate(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(date);
}

export function PostCard({ post }: { post: PostListItem }) {
  const author = post.author.trim() || "익명";
  const created = formatDate(post.createdAt);

  return (
    <Link
      href={`/post/${post.id}`}
      className="flex items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-emerald-50/60"
    >
      <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
        <span className="truncate text-sm font-semibold text-slate-900">{post.title}</span>
        <span className="whitespace-nowrap text-sm font-semibold text-slate-700">{author}</span>
        <span className="whitespace-nowrap text-sm text-slate-500">{created}</span>
      </div>
    </Link>
  );
}
