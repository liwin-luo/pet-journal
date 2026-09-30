import { notFound } from "next/navigation";

/** 捕获未匹配路径，交给 [locale]/not-found 呈现本地化 404。 */
export default function CatchAll() {
  notFound();
}
