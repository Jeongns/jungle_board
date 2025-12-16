"use client";

import { useRouter } from "next/navigation";

import { PostForm } from "@/components/board/PostForm";
import { API_BASE_URL } from "@/constants/env";

export default function NewPostPage() {
  const router = useRouter();

  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">새 글 작성</h1>
        <p className="text-sm text-slate-600">작성 후 상세 화면으로 이동합니다.</p>
      </div>
      <PostForm
        submitLabel="작성하기"
        onSubmit={async ({ title, content }) => {
          const response = await fetch(`${API_BASE_URL}/post`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title.trim(), content: content.trim() }),
            credentials: "include",
          });

          if (response.status === 401) {
            router.replace("/login");
            return;
          }

          if (!response.ok) {
            throw new Error(`요청 실패 (${response.status})`);
          }

          const data = (await response.json()) as { id: number };
          router.push(`/post/${data.id}`);
        }}
        onCancel={() => router.push("/")}
      />
    </div>
  );
}
