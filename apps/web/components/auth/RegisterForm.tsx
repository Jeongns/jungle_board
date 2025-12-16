"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = isValidEmail(email) && Boolean(name.trim()) && password.trim().length >= 8;

  return (
    <Card className="grid gap-5 p-7">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);

          if (!isValidEmail(email)) {
            setError("이메일 형식을 확인해주세요.");
            return;
          }
          if (!name.trim()) {
            setError("이름을 입력해주세요.");
            return;
          }
          if (password.trim().length < 8) {
            setError("비밀번호는 8자 이상으로 입력해주세요.");
            return;
          }

          setIsSubmitting(true);
          try {
            const payload = { email: email.trim(), name: name.trim(), password: password.trim() };
            window.alert(`회원가입 (데모)\n\n${JSON.stringify(payload, null, 2)}`);
          } catch {
            setError("요청 처리에 실패했어요.");
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

        <Field label="이름" hint="필수">
          <Input
            autoComplete="name"
            placeholder="예) 홍길동"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>

        <Field label="비밀번호" hint="8자 이상">
          <Input
            type="password"
            autoComplete="new-password"
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
          {isSubmitting ? "처리 중..." : "회원가입"}
        </Button>

        <Link href="/login" className="text-center text-sm font-semibold text-slate-700 hover:underline">
          이미 계정이 있나요? 로그인
        </Link>
      </form>
    </Card>
  );
}

