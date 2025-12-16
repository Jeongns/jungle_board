"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type Values = {
  title: string;
  content: string;
};

export function PostForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialValues?: Partial<Values>;
  submitLabel: string;
  onSubmit: (values: Values) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const defaults = useMemo<Values>(
    () => ({
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
    }),
    [initialValues],
  );

  const [values, setValues] = useState<Values>(defaults);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDisabled = !values.title.trim() || !values.content.trim();

  return (
    <Card className="grid gap-5 p-7">
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setIsSubmitting(true);
          try {
            await onSubmit(values);
          } catch (caught) {
            setError(caught instanceof Error ? caught.message : "요청에 실패했어요.");
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <Field label="제목" hint="필수">
          <Input
            value={values.title}
            onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="예) 오늘의 회고"
            maxLength={80}
            required
          />
        </Field>

        <Field label="내용" hint="필수">
          <Textarea
            value={values.content}
            onChange={(event) => setValues((prev) => ({ ...prev, content: event.target.value }))}
            placeholder="내용을 입력하세요."
            required
          />
        </Field>

        {error ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button variant="ghost" disabled={isSubmitting} onClick={onCancel}>
              취소
            </Button>
          ) : null}
          <Button type="submit" disabled={isSubmitting || submitDisabled}>
            {isSubmitting ? "저장 중..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
