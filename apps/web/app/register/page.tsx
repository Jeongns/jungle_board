import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="mx-auto grid w-full max-w-lg gap-4">
      <div className="grid gap-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">회원가입</h1>
        <p className="text-sm text-slate-600">이메일, 이름, 비밀번호를 입력하세요.</p>
      </div>
      <RegisterForm />
    </div>
  );
}
