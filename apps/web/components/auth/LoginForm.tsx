"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { login } from "@/services/auth";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = isValidEmail(email) && password.trim().length >= 8;

  return (
    <Card className="grid gap-5 p-7">
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);

          if (!isValidEmail(email)) {
            setError("이메일 형식을 확인해주세요.");
            return;
          }
          if (password.trim().length < 8) {
            setError("비밀번호는 8자 이상으로 입력해주세요.");
            return;
          }

          setIsSubmitting(true);
          try {
            await login({ email: email.trim(), password: password.trim() });
          } catch (caught) {
            setError(caught instanceof Error ? caught.message : "요청 처리에 실패했어요.");
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <Field label="이메일" hint="필수">
          <Input
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>

        <Field label="비밀번호" hint="8자 이상">
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Field>

        {error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        ) : null}

        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "처리 중..." : "로그인"}
        </Button>

        <Link href="/register" className="text-center text-sm font-semibold text-slate-700 hover:underline">
          계정이 없나요? 회원가입
        </Link>
      </form>
    </Card>
  );
}
