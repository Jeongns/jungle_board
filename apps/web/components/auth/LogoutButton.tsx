"use client";

import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/constants/env";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="rounded-full px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
      onClick={async () => {
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
          });
        } finally {
          router.replace("/login");
          router.refresh();
        }
      }}
    >
      로그아웃
    </button>
  );
}
