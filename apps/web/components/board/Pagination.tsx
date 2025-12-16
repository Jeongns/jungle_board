"use client";

import { Button } from "@/components/ui/Button";

export function Pagination({
  page,
  pageCount,
  onPageChange,
  alwaysShow,
}: {
  page: number;
  pageCount: number;
  onPageChange: (nextPage: number) => void;
  alwaysShow?: boolean;
}) {
  if (!alwaysShow && pageCount <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        이전
      </Button>
      <span className="px-3 text-sm text-slate-600">
        {page} / {pageCount}
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
      >
        다음
      </Button>
    </div>
  );
}
