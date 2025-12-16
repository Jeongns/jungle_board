import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="mx-auto grid w-full max-w-lg gap-4">
      <div className="grid gap-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">로그인</h1>
        <p className="text-sm text-slate-600">이메일과 비밀번호를 입력하세요.</p>
      </div>
      <LoginForm />
    </div>
  );
}
