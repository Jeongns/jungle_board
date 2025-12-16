import type { Post } from "@/components/board/types";

function formatDate(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function PostMeta({ post }: { post: Post }) {
  const created = formatDate(post.createdAt);
  const updated = formatDate(post.updatedAt);
  const showUpdated = post.updatedAt !== post.createdAt;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
      <span>작성 {created}</span>
      {showUpdated ? <span>수정 {updated}</span> : null}
    </div>
  );
}
