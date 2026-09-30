import type { ChatProvider, StillProvider } from "./providers";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Mock 引擎：没配密钥时返回占位 SVG，开发零成本跑通全流程。 */
export const mockStill: StillProvider = {
  name: "mock",
  async still(prompt) {
    const label = esc(prompt.slice(0, 90));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="864" height="1152" viewBox="0 0 864 1152">
<rect width="864" height="1152" fill="#FAF6EF"/>
<rect x="32" y="32" width="800" height="1088" rx="24" fill="#F3ECDF" stroke="#E0715C" stroke-width="3" stroke-dasharray="12 8"/>
<g transform="translate(432,470)">
<circle r="150" fill="#E0715C" opacity="0.15"/>
<path d="M-70 -40 a70 70 0 0 1 140 0 l10 60 a80 80 0 0 1 -160 0 z" fill="#E0715C" opacity="0.5"/>
<circle cx="-62" cy="-52" r="34" fill="#E0715C" opacity="0.5"/>
<circle cx="62" cy="-52" r="34" fill="#E0715C" opacity="0.5"/>
<circle cx="-28" cy="-10" r="9" fill="#3D2E24"/>
<circle cx="28" cy="-10" r="9" fill="#3D2E24"/>
<path d="M-14 26 q14 12 28 0" stroke="#3D2E24" stroke-width="6" fill="none" stroke-linecap="round"/>
</g>
<text x="432" y="760" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#3D2E24">Mock preview</text>
<text x="432" y="812" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#6B5A4E">${label}</text>
<text x="432" y="1050" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#B8A894">Set ARK_API_KEY for real generations</text>
</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  },
};

export const mockChat: ChatProvider = {
  name: "mock",
  async chat() {
    throw new Error("mock chat");
  },
};
