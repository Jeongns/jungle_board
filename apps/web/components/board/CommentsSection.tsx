"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { API_BASE_URL } from "@/constants/env";

type Comment = {
  id: number;
  name: string;
  content: string;
  createdAt: string;
};

type ApiComment = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

type ApiGetCommentsResponse = {
  comments: ApiComment[];
};

function mapComment(comment: ApiComment): Comment {
  return {
    id: comment.id,
    name: comment.username ?? "익명",
    content: comment.content,
    createdAt: comment.createdAt,
  };
}

function CommentItem({ comment, onDelete }: { comment: Comment; onDelete: () => void }) {
  return (
    <div className="grid gap-2 px-4 py-4 transition hover:bg-emerald-50/40">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-900">{comment.name}</span>
            <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          삭제
        </Button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{comment.content}</p>
    </div>
  );
}

export function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = content.trim().length > 0;

  useEffect(() => {
    const numericPostId = Number(postId);
    if (!Number.isFinite(numericPostId) || numericPostId <= 0) {
      setComments([]);
      setError("댓글을 불러올 수 없습니다.");
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/comment/${numericPostId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("로그인이 필요합니다.");
          }
          throw new Error(`요청 실패 (${response.status})`);
        }

        const data = (await response.json()) as ApiGetCommentsResponse;
        if (cancelled) return;
        setComments(data.comments.map(mapComment));
      } catch (caught) {
        if (cancelled) return;
        setComments([]);
        setError(caught instanceof Error ? caught.message : "댓글을 불러오지 못했어요.");
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  async function reload() {
    const numericPostId = Number(postId);
    const response = await fetch(`${API_BASE_URL}/comment/${numericPostId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) return;
    const data = (await response.json()) as ApiGetCommentsResponse;
    setComments(data.comments.map(mapComment));
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3">
        <div className="grid gap-0.5">
          <h2 className="text-sm font-bold text-slate-900">댓글</h2>
          <p className="text-xs text-slate-500">
            {isLoading ? "불러오는 중..." : `총 ${comments.length}개`}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {error ? (
          <div className="rounded-2xl bg-white/40 p-5 text-sm text-slate-600">{error}</div>
        ) : comments.length ? (
          <div className="overflow-hidden rounded-2xl bg-white/60 divide-y divide-slate-100">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={async () => {
                  const ok = window.confirm("댓글을 삭제할까요?");
                  if (!ok) return;

                  const response = await fetch(`${API_BASE_URL}/comment/${comment.id}`, {
                    method: "DELETE",
                    credentials: "include",
                  });
                  if (!response.ok) return;
                  await reload();
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white/40 p-5 text-sm text-slate-600">
            아직 댓글이 없어요. 첫 댓글을 남겨보세요.
          </div>
        )}
      </div>

      <form
        className="grid gap-3 rounded-2xl bg-white/60 p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!canSubmit) return;

          const numericPostId = Number(postId);
          const response = await fetch(`${API_BASE_URL}/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: numericPostId, content: content.trim() }),
            credentials: "include",
          });
          if (!response.ok) return;

          setContent("");
          await reload();
        }}
      >
        <Field label="댓글" hint="필수">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="댓글을 입력하세요."
            className="min-h-20"
            required
          />
        </Field>

        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!canSubmit}>
            댓글 작성
          </Button>
        </div>
      </form>
    </div>
  );
}
