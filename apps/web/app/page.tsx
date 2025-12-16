"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/board/EmptyState";
import { Pagination } from "@/components/board/Pagination";
import { PostCard } from "@/components/board/PostCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { API_BASE_URL } from "@/constants/env";
import type { PostListItem } from "@/components/board/types";

function toInt(value: string | null, fallback: number) {
  const parsed = Number(value ?? "");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

type BoardListResponse = {
  page: number;
  totalCount: number;
  limit: number;
  items: Array<{
    id: number;
    title: string;
    username: string;
    createdAt: string;
  }>;
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const [draftQuery, setDraftQuery] = useState(query);

  const pageSize = 8;
  const requestedPage = toInt(searchParams.get("page"), 1);
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(totalCount / pageSize)),
    [pageSize, totalCount],
  );
  const page = Math.min(requestedPage, pageCount);

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

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("search", query);
        params.set("page", String(page));
        params.set("limit", String(pageSize));

        const response = await fetch(`${API_BASE_URL}/board?${params.toString()}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`요청 실패 (${response.status})`);
        }

        const data = (await response.json()) as BoardListResponse;
        const mapped: PostListItem[] = data.items.map((item) => ({
          id: item.id,
          title: item.title,
          author: item.username,
          createdAt: item.createdAt,
        }));

        if (cancelled) return;
        setPosts(mapped);
        setTotalCount(data.totalCount);

        const nextPageCount = Math.max(1, Math.ceil(data.totalCount / pageSize));
        if (requestedPage > nextPageCount && nextPageCount > 0) {
          pushQuery({ page: nextPageCount });
        }
      } catch (caught) {
        if (cancelled) return;
        setError(caught instanceof Error ? caught.message : "목록을 불러오지 못했어요.");
        setPosts([]);
        setTotalCount(0);
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL, page, pageSize, query, requestedPage]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">게시판</h1>
          <p className="text-sm text-slate-600">
            전체 {totalCount}개 · {page}/{pageCount} 페이지
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

      {isLoading ? (
        <Card className="divide-y divide-slate-100 p-0">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="h-4 w-1/2 rounded bg-slate-100" />
                <div className="h-4 w-32 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </Card>
      ) : posts.length ? (
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
          title={error ? "목록을 불러오지 못했어요" : query ? "검색 결과가 없어요" : "아직 게시글이 없어요"}
          description={error ?? (query ? "다른 키워드로 다시 검색해보세요." : "첫 글을 작성해보세요.")}
          actionHref="/post/new"
        />
      )}
    </div>
  );
}
