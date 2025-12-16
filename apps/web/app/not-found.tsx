export default function NotFound() {
  return (
    <div className="grid gap-3 rounded-3xl border border-white/40 bg-white/70 p-8 text-center shadow-[0_18px_50px_-28px_rgba(15,23,42,0.30)] backdrop-blur">
      <h1 className="text-2xl font-black tracking-tight text-slate-900">페이지를 찾을 수 없어요</h1>
      <p className="text-sm text-slate-600">주소를 확인하거나 목록으로 돌아가세요.</p>
    </div>
  );
}
