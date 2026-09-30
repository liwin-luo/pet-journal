// 配了 Supabase 走表；否则本地 SQLite（.data/app.sqlite）。
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { readState, writeState } from "@/lib/sqlite";

export interface UserData {
  pets: unknown[];
  orders: unknown[];
  diary: unknown[];
}

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let sb: SupabaseClient | null = null;
function supabase(): SupabaseClient {
  if (!sb) sb = createClient(SB_URL!, SB_KEY!);
  return sb;
}

export async function getUserData(userId: string): Promise<UserData> {
  if (SB_URL && SB_KEY) {
    const [pets, orders, diary] = await Promise.all([
      supabase().from("pets").select("*").eq("user_id", userId),
      supabase().from("orders").select("*").eq("user_id", userId),
      supabase().from("diary").select("*").eq("user_id", userId),
    ]);
    return {
      pets: pets.data ?? [],
      orders: (orders.data ?? []).sort((a: any, b: any) => b.created_at?.localeCompare?.(a.created_at) ?? 0),
      diary: diary.data ?? [],
    };
  }
  return readState(userId);
}

export async function putUserData(userId: string, data: UserData): Promise<void> {
  if (SB_URL && SB_KEY) {
    const s = supabase();
    // MVP 策略：整体替换该用户三表数据（单用户单写者，规模小；并发写场景迁移 upsert）
    const jobs: any[] = [];
    jobs.push(s.from("pets").delete().eq("user_id", userId));
    jobs.push(s.from("orders").delete().eq("user_id", userId));
    jobs.push(s.from("diary").delete().eq("user_id", userId));
    const ins = (table: string, rows: unknown[]) => {
      if (rows.length) jobs.push(s.from(table).insert((rows as any[]).map((r) => ({ ...r, user_id: userId }))));
    };
    ins("pets", data.pets);
    ins("orders", data.orders);
    ins("diary", data.diary);
    await Promise.all(jobs);
    return;
  }
  writeState(userId, data);
}
