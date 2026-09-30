"use client";
// 状态存储：localStorage 即时缓存 + 服务端双向同步（/api/state，debounce 全量推送）
// 数据权威源在服务端（Auth 用户维度）；刷新/换设备由 syncFromServer 恢复
import { AppState, emptyPet, Lang } from "./types";

const KEY = "petpics_state_v1";
let syncTimer: ReturnType<typeof setTimeout> | null = null;

export const defaultState = (): AppState => ({
  lang: "en",
  pets: [],
  curPetId: null,
  citedPetIds: [],
  orders: [],
  diary: [],
  intent: "",
  selectedStyle: null,
  selectedTemplate: null,
  customDesc: "",
  paid: false,
  plan: "free",
  credits: 0,
  creditDay: "",
  creditUsed: 0,
});

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultState(), ...JSON.parse(raw) };
  } catch {}
  // 新用户从空状态开始（绝不预置演示宠物——否则跳过上传/锚点直达付费）
  return defaultState();
}

export function saveState(s: AppState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function updateState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)): AppState {
  const s = loadState();
  const p = typeof patch === "function" ? patch(s) : patch;
  const next = { ...s, ...p };
  saveState(next);
  queueSync();
  return next;
}

export function curPet(s: AppState) {
  return s.pets.find((p) => p.id === s.curPetId) ?? null;
}

export function setLangStored(lang: Lang) {
  updateState({ lang });
}

/** 登录/进站时：以服务端数据覆盖本地（多设备一致性） */
export async function syncFromServer(): Promise<void> {
  try {
    const res = await fetch("/api/state", { cache: "no-store" });
    if (!res.ok) return; // 401 → 由 AppData 网关处理跳登录
    const data = await res.json();
    const s = loadState();
    const serverEmpty = !(data.pets?.length || data.orders?.length || data.diary?.length);
    const localHas = Boolean(s.pets.length || s.orders.length || s.diary.length);
    if (serverEmpty && localHas) {
      await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pets: s.pets, orders: s.orders, diary: s.diary }),
      });
    }
    const pets = serverEmpty && localHas ? s.pets : (data.pets ?? []);
    const orders = serverEmpty && localHas ? s.orders : (data.orders ?? []);
    const diary = serverEmpty && localHas ? s.diary : (data.diary ?? []);
    saveState({
      ...s,
      pets,
      orders,
      diary,
      curPetId: pets.length ? (pets.find((p: { id: string }) => p.id === s.curPetId)?.id ?? pets[0].id) : null,
      plan: data.plan === "studio" || data.plan === "home" ? data.plan : "free",
      credits: Number(data.credits) || 0,
      creditDay: typeof data.creditDay === "string" ? data.creditDay : "",
      monthUsed: Number(data.monthUsed) || 0,
    });
  } catch {}
}

let pendingSync = false;
function queueSync() {
  if (typeof window === "undefined") return;
  pendingSync = true;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(pushToServer, 800);
}
async function pushToServer() {
  if (!pendingSync) return;
  pendingSync = false;
  const { pets, orders, diary } = loadState();
  try {
    await fetch("/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pets, orders, diary }),
    });
  } catch {}
}
