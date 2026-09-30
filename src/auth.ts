// Auth.js v5：Google + 邮箱 magic link（Resend）+ Demo 凭据（未配置真实提供商时的本地回退）
// 配置说明见 README「用户体系」；AUTH_ENABLED = 是否配置了真实 OAuth
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";

export const AUTH_ENABLED = Boolean(process.env.GOOGLE_CLIENT_ID);

const providers = [];
if (process.env.GOOGLE_CLIENT_ID) providers.push(Google);
if (process.env.AUTH_RESEND_KEY) providers.push(Resend({ from: process.env.MAIL_FROM || "hello@petpics.app" }));
// Demo 回退：无任何真实提供商时仍可邮箱进入（仅本地开发）
if (providers.length === 0) {
  providers.push(
    Credentials({
      credentials: { email: { label: "Email" } },
      authorize: async (c) => {
        const email = String(c.email || "demo@petpics.app");
        return { id: email, email };
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET || "dev-secret-local-only",
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
});
