"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { EmptyState } from "@/components/board/EmptyState";
import { Pagination } from "@/components/board/Pagination";
import { PostCard } from "@/components/board/PostCard";
import { DUMMY_POSTS } from "@/components/board/dummyPosts";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

function toInt(value: string | null, fallback: number) {
  const parsed = Number(value ?? "");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const [draftQuery, setDraftQuery] = useState(query);

  const pageSize = 8;
  const requestedPage = toInt(searchParams.get("page"), 1);
  const q = query.trim().toLowerCase();
  const filteredPosts = q
    ? DUMMY_POSTS.filter((post) => {
        const haystack = `${post.title}\n${post.content}`.toLowerCase();
        return haystack.includes(q);
      })
    : DUMMY_POSTS;

  const total = filteredPosts.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * pageSize;
  const posts = filteredPosts.slice(start, start + pageSize);

  const pushQuery = (next: { page?: number; q?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      const trimmed = next.q.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
    }
    if (next.page !== undefined) {
      if (next.page <= 1) params.delete("page");
      else params.set("page", String(next.page));
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">게시판</h1>
          <p className="text-sm text-slate-600">
            더미 게시글 {total}개 · {page}/{pageCount} 페이지
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <form
            className="flex w-full items-center gap-2 sm:w-[420px]"
            onSubmit={(event) => {
              event.preventDefault();
              pushQuery({ q: draftQuery, page: 1 });
            }}
          >
            <Input
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              placeholder="제목/내용 검색"
            />
            <Button variant="secondary" type="submit">
              검색
            </Button>
          </form>
          <Link href="/post/new">
            <Button>새 글</Button>
          </Link>
        </div>
      </div>

      {posts.length ? (
        <div className="grid gap-4">
          {query ? (
            <Card className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-700">
                검색어 <span className="font-semibold text-slate-900">“{query}”</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraftQuery("");
                  pushQuery({ q: "", page: 1 });
                }}
              >
                검색 초기화
              </Button>
            </Card>
          ) : null}

          <Card className="divide-y divide-slate-100 p-0">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Card>
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={(p) => pushQuery({ page: p })}
            alwaysShow
          />
        </div>
      ) : (
        <EmptyState
          title={query ? "검색 결과가 없어요" : "아직 게시글이 없어요"}
          description={
            query ? "다른 키워드로 다시 검색해보세요." : "저장/조회/검색 같은 데이터 로직은 나중에 연결하면 됩니다."
          }
          actionHref="/post/new"
          actionLabel="작성 화면 보기"
        />
      )}
    </div>
  );
}
