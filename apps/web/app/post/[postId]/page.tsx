"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PostDetailShell } from "@/components/board/PostDetailShell";
import type { Post } from "@/components/board/types";
import { API_BASE_URL } from "@/constants/env";

type PostDetailResponse = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function PostDetailPage() {
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
      if (!response.ok) return;

      const data = (await response.json()) as PostDetailResponse;
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
  }, [postId]);

  if (!post) return <div>불러오는 중...</div>;
  return (
    <PostDetailShell
      post={post}
      editHref={`/post/${postId}/edit`}
      onDelete={async () => {
        const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) {
          throw new Error(`요청 실패 (${response.status})`);
        }
        router.replace("/");
      }}
    />
  );
}
