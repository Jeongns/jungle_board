"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PostForm } from "@/components/board/PostForm";
import type { Post } from "@/components/board/types";
import { API_BASE_URL } from "@/constants/env";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ postId: string }>();
  const postId = params.postId;

  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok) return;

      const data = (await response.json()) as {
        id: number;
        title: string;
        content: string;
        createdAt: string;
        updatedAt: string;
      };
      if (cancelled) return;
      setPost({
        id: String(data.id),
        title: data.title,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [postId, router]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">게시글 수정</h1>
          <p className="text-sm text-slate-600">
            <Link href={`/post/${postId}`} className="font-semibold text-slate-800 hover:underline">
              상세로 돌아가기
            </Link>
          </p>
        </div>
      </div>

      {post ? (
        <PostForm
          initialValues={{ title: post.title, content: post.content }}
          submitLabel="수정 저장"
          onSubmit={async ({ title, content }) => {
            const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
              method: "PATCH",
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
            router.push(`/post/${postId}`);
          }}
          onCancel={() => router.push(`/post/${postId}`)}
        />
      ) : (
        <div>불러오는 중...</div>
      )}
    </div>
  );
}

