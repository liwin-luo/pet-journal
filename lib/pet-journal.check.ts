/**
 * 拼装、隔离、自动稿自检。失败即非 0。
 * 所属模块：labs/pet-journal
 */
import assert from "node:assert/strict";
import {
  buildDiaryImagePrompt,
  canAutoDraft,
  draftDiaryBody,
  validateDiaryWrite,
} from "./diary-copy.ts";
import { publicImageError } from "./generate-image.ts";
import { fill, messages, parseLocale } from "./i18n.ts";
import { poolConfig } from "./db/client.ts";
import { googleRedirectUri, publicOrigin } from "./google-oauth.ts";
import { readSession, signSession } from "./session-cookie.ts";
import { authStatus, scopeByUser, shouldBlockAuto } from "./scope.ts";
import {
  buildPrompt,
  findTemplate,
  letteringText,
  TEMPLATES,
  validateGenerate,
} from "./templates.ts";
import type { PromptPet } from "./types.ts";

const pet: PromptPet = {
  name: "豆豆",
  species: "cat",
  breed: "橘猫",
  sex: "male",
  age: "adult",
  traits: ["二货"],
  hobbies: "晒太阳",
  toys: "逗猫棒",
  food: "冻干",
  catchphrase: "",
};

process.env.AUTH_SECRET ??= "check-secret";
const cookie = signSession("user-a", 1_000);
assert.equal(readSession(cookie, 1_001), "user-a");
assert.equal(readSession(cookie, 1_000 + 8 * 24 * 60 * 60 * 1000), undefined);

const localReq = new Request("http://127.0.0.1:3000/api/auth/google");
assert.equal(publicOrigin(localReq), "http://127.0.0.1:3000");
assert.equal(googleRedirectUri(localReq), "http://127.0.0.1:3000/api/auth/google/callback");
const vercelReq = new Request("https://www.petsdaily.live/api/auth/google", {
  headers: { "x-forwarded-proto": "https", "x-forwarded-host": "www.petsdaily.live" },
});
assert.equal(googleRedirectUri(vercelReq), "https://www.petsdaily.live/api/auth/google/callback");

assert.equal(poolConfig("postgres://postgres:postgres@localhost:5432/pet_journal").max, 5);
assert.equal(poolConfig("postgres://postgres:postgres@localhost:5432/pet_journal").ssl, undefined);
const supabase = poolConfig(
  "postgres://postgres.ref:x@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require",
);
assert.equal(supabase.max, 1);
assert.deepEqual(supabase.ssl, { rejectUnauthorized: false });
assert.equal(new URL(supabase.connectionString ?? "").searchParams.get("sslmode"), null);

assert.equal(authStatus(undefined), 401);
assert.equal(authStatus(""), 401);
assert.equal(authStatus("user-a"), 200);

const rows = [
  { userId: "a", name: "豆豆" },
  { userId: "b", name: "球球" },
];
assert.deepEqual(scopeByUser(rows, "a").map((row) => row.name), ["豆豆"]);
assert.deepEqual(scopeByUser(rows, "b").map((row) => row.name), ["球球"]);
assert.deepEqual(scopeByUser(rows, "c"), []);

assert.equal(shouldBlockAuto(true, "auto"), true);
assert.equal(shouldBlockAuto(false, "auto"), false);
assert.equal(shouldBlockAuto(true, "prompt"), false);

assert.equal(letteringText(pet), "豆豆");
assert.equal(validateGenerate({ name: "豆豆", photos: [] }, undefined, "home").ok, false);
assert.equal(validateGenerate({ name: "豆豆", photos: ["x"] }, undefined, "home").ok, true);
assert.equal(findTemplate("nope"), undefined);

for (const template of TEMPLATES) {
  const friend = template.needsFriend
    ? { name: "球球", species: "dog" as const, relation: "playmate" as const }
    : undefined;
  const prompt = buildPrompt(pet, friend, template.id);
  assert.match(prompt, /豆豆/);
  if (template.id === "duo") assert.match(prompt, /球球/);
}

assert.equal(canAutoDraft(false), true);
assert.equal(canAutoDraft(true), false);
assert.equal(validateDiaryWrite({ name: "豆豆", source: "prompt" }).ok, false);
assert.equal(validateDiaryWrite({ name: "豆豆", source: "auto" }).ok, true);

const autoBody = draftDiaryBody({ pet, date: "2026-09-20", source: "auto" });
assert.match(autoBody, /豆豆/);
const prompted = draftDiaryBody({
  pet,
  date: "2026-09-20",
  source: "prompt",
  userNote: "下雨没出门",
});
assert.match(prompted, /豆豆/);
assert.match(prompted, /下雨没出门/);
assert.match(buildDiaryImagePrompt(pet, prompted), /下雨没出门/);
assert.doesNotMatch(buildPrompt(pet, undefined, "home"), /下雨没出门/);
assert.match(publicImageError("timeout of 240000ms"), /超时/);
assert.match(publicImageError("EROFS"), /磁盘/);
assert.equal(parseLocale("en-US"), "en");
assert.equal(parseLocale("ko-KR"), "ko");
assert.equal(parseLocale("ja"), "ja");
assert.equal(fill("{n} 只", { n: 3 }), "3 只");
assert.equal(messages.zh.landing.plans.length, 3);
assert.equal(messages.en.landing.features.length, 4);
assert.equal(messages.ko.templates.home.title.length > 0, true);
assert.equal(messages.ja.labels.species.cat, "猫");

console.log("pet-journal.check ok");
