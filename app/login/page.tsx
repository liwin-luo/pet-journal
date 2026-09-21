const HINTS: Record<string, string> = {
  config: "Vercel 还没配 AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET。",
  google: "Google 拒绝了这次登录。",
  state: "登录状态过期，再点一次。",
  callback: "登录回调失败。多半是 DATABASE_URL 连不上，或 Google 回调地址还没登记线上域名。",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const hint = error ? HINTS[error] ?? "登录没成功，再试一次。" : "";
  return (
    <section className="mt-10 text-center">
      <p className="display text-3xl">先用 Google 进来</p>
      <p className="mt-2 text-sm text-[#6b5a4a]">一个账号一份手账，看不到别人的宠和日记。</p>
      {hint ? <p className="mt-4 text-sm text-[#b42318]">{hint}</p> : null}
      <a href="/api/auth/google" className="btn mt-8 w-full">
        用 Google 继续
      </a>
    </section>
  );
}
