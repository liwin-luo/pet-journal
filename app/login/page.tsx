const HINTS: Record<string, string> = {
  config: "Vercel 还没配 AUTH_SECRET 或 Google Key。打开 /api/ready，auth 和 google 都要是 true。",
  google: "Google 换 token 失败。核对 Vercel 里的 AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET 是否是同一对。",
  state: "登录状态过期，再点一次。",
  db: "Vercel 的 DATABASE_URL 连不上 Supabase。要用事务池 6543 那条，并 Redeploy。",
  callback: "登录回调失败。打开 /api/ready：auth 必须是 true（现在缺 AUTH_SECRET）。",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const hint = error ? HINTS[error] ?? "登录没成功，再试一次。" : "";
  return (
    <div className="login-split">
      <aside className="login-hero">
        <div>
          <p className="stamp">PET JOURNAL</p>
          <h1 className="display mt-8 text-5xl leading-none">给家里那只<br />留一篇今天</h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#5a4030]">
            日记是首页。档案、物品和喜好会变成更像它的图。各看各的，互不可见。
          </p>
        </div>
        <p className="text-sm text-[#5a4030]/80">Petsdaily · 宠物手账工坊</p>
      </aside>
      <section className="flex items-center justify-center px-6 py-16">
        <div className="card w-full max-w-md p-8">
          <p className="stamp mb-5 lg:hidden">PET JOURNAL</p>
          <p className="text-[11px] tracking-[0.16em] text-mute uppercase">Welcome</p>
          <h2 className="display mt-3 text-3xl leading-none">先用 Google 进来</h2>
          <p className="mt-3 text-sm leading-6 text-mute">一个账号一份手账。登录后从今天的日记开始。</p>
          {hint ? <p className="mt-4 text-sm text-stamp">{hint}</p> : null}
          <a href="/api/auth/google" className="btn mt-8 w-full">
            用 Google 继续
          </a>
        </div>
      </section>
    </div>
  );
}
