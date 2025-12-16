import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";

import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/LogoMark";
import { LogoutButton } from "@/components/auth/LogoutButton";

export async function AppShell({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("access_token")?.value);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-white/30 bg-white/70 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <LogoMark />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                board lab
              </span>
              <span className="text-sm font-semibold text-slate-900">게시판</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <Link
                href="/login"
                className="rounded-full px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                로그인
              </Link>
            )}
          </nav>
        </Container>
      </header>

      <main className="flex-1 py-8">
        <Container>{children}</Container>
      </main>

      <footer className="border-t border-white/30 bg-white/50 py-8 text-sm text-slate-600">
        <Container className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>크래프톤 정글 이정훈</span>
          <span className="text-slate-500">Next.js + Tailwind CSS</span>
        </Container>
      </footer>
    </div>
  );
}
