"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";

type Comment = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function initialDummyComments(postId: string): Comment[] {
  const now = Date.now();
  return [
    {
      id: `${postId}-c1`,
      name: "익명",
      content: "댓글 UI 예시입니다. 데이터 연결은 나중에 붙이면 돼요.",
      createdAt: new Date(now - 1000 * 60 * 32).toISOString(),
    },
    {
      id: `${postId}-c2`,
      name: "보드랩",
      content: "작성 폼에서 이름/내용을 입력해보세요.",
      createdAt: new Date(now - 1000 * 60 * 8).toISOString(),
    },
  ];
}

function CommentItem({ comment, onDelete }: { comment: Comment; onDelete: () => void }) {
  return (
    <div className="grid gap-2 px-4 py-4 transition hover:bg-emerald-50/40">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
            {comment.name.trim().slice(0, 1) || "?"}
          </span>
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
  const [comments, setComments] = useState<Comment[]>(() => initialDummyComments(postId));
  const [content, setContent] = useState("");

  const canSubmit = content.trim().length > 0;

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3">
        <div className="grid gap-0.5">
          <h2 className="text-sm font-bold text-slate-900">댓글</h2>
          <p className="text-xs text-slate-500">총 {comments.length}개</p>
        </div>
      </div>

      <div className="grid gap-3">
        {comments.length ? (
          <div className="overflow-hidden rounded-2xl bg-white/60 divide-y divide-slate-100">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={() => {
                  const ok = window.confirm("댓글을 삭제할까요?");
                  if (!ok) return;
                  setComments((prev) => prev.filter((c) => c.id !== comment.id));
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
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) return;

          const next: Comment = {
            id: makeId(),
            name: "익명",
            content: content.trim(),
            createdAt: new Date().toISOString(),
          };
          setComments((prev) => [next, ...prev]);
          setContent("");
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
