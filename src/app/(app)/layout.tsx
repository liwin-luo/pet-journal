// 应用区布局：登录网关 + 服务端状态同步（落地页/登录页不经过此组）
import { AppData } from "@/components/AppData";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppData>{children}</AppData>;
}
