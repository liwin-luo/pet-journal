"use client";
// 底部 Tab 导航：功能发现入口（创作/作品库/日记/宠物/账户）
// 上传页与风格页有自己的底部结算条，导航在这两页隐藏（避免遮挡）
import { useI18n } from "./I18n";
import { usePathname } from "next/navigation";

const TABS: { href: string; ic: string; key: string }[] = [
  { href: "/create", ic: "🎨", key: "create" },
  { href: "/library", ic: "🖼️", key: "library" },
  { href: "/diary", ic: "✍️", key: "diary" },
];

export function BottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/upload" || pathname === "/styles" || pathname === "/plaza") return null;
  return (
    <nav className="bottom-nav">
      {TABS.map(({ href, ic, key }) => {
        const on = pathname === href || pathname.startsWith(href + "/");
        return (
          <a key={href} href={href} className={on ? "on" : ""}>
            <span className="ic">{ic}</span>
            {t(`nav.${key}`)}
          </a>
        );
      })}
    </nav>
  );
}
