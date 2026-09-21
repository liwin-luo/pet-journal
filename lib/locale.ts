import { cookies, headers } from "next/headers";
import { isLocale, LOCALE_COOKIE, parseLocale, type Locale } from "./i18n.ts";

export async function readLocale(): Promise<Locale> {
  const jar = await cookies();
  const saved = jar.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  const accept = (await headers()).get("accept-language");
  return parseLocale(accept?.split(",")[0]);
}
