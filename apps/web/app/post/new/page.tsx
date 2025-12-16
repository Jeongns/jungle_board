"use client";

import { PostForm } from "@/components/board/PostForm";

export default function NewPostPage() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">새 글 작성</h1>
        <p className="text-sm text-slate-600">데이터 저장 로직은 아직 구현 전입니다.</p>
      </div>
      <PostForm
        submitLabel="작성하기"
        onSubmit={() => {
          window.alert("데이터 저장 로직은 나중에 구현할 예정입니다.");
        }}
      />
    </div>
  );
}
