export default function LoginPage() {
  return (
    <section className="mt-10 text-center">
      <p className="display text-3xl">先用 Google 进来</p>
      <p className="mt-2 text-sm text-[#6b5a4a]">一个账号一份手账，看不到别人的宠和日记。</p>
      <a href="/api/auth/google" className="btn mt-8 w-full">
        用 Google 继续
      </a>
    </section>
  );
}
