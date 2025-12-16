import Link from "next/link";

import { EmptyState } from "@/components/board/EmptyState";

export default function EditPostPage() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">게시글 수정</h1>
          <p className="text-sm text-slate-600">
            <Link href="/" className="font-semibold text-slate-800 hover:underline">
              목록으로 돌아가기
            </Link>
          </p>
        </div>
      </div>

      <EmptyState
        title="수정 기능은 준비 중이에요"
        description="게시글 수정/저장 로직(`/lib`)은 나중에 구현할 예정입니다."
        actionHref="/"
        actionLabel="목록으로"
      />
    </div>
  );
}
