import Link from "next/link";

import { CommentsSection } from "@/components/board/CommentsSection";
import { PostMeta } from "@/components/board/PostMeta";
import type { Post } from "@/components/board/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function PostDetailShell({
  post,
  backHref = "/",
  editHref,
}: {
  post: Post;
  backHref?: string;
  editHref?: string;
}) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href={backHref} className="text-sm font-semibold text-slate-700 hover:underline">
          ← 목록으로
        </Link>

        <div className="flex flex-wrap gap-2">
          {editHref ? (
            <Link href={editHref}>
              <Button variant="secondary" size="sm">
                수정
              </Button>
            </Link>
          ) : null}
          <Button variant="danger" size="sm" disabled>
            삭제
          </Button>
        </div>
      </div>

      <Card className="grid gap-4 p-8">
        <div className="grid gap-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">{post.title}</h1>
          <PostMeta post={post} />
        </div>

        <div className="rounded-2xl bg-white/60 p-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {post.content}
          </div>
        </div>

        <hr className="border-slate-100" />

        <CommentsSection postId={post.id} />
      </Card>
    </div>
  );
}
