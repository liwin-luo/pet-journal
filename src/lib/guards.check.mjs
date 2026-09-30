// 跑法：node src/lib/guards.check.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const src = readFileSync(fileURLToPath(new URL("./guards.ts", import.meta.url)), "utf8");
const js = ts.transpileModule(src, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const module = { exports: {} };
vm.runInNewContext(js, { module, exports: module.exports, require });
const { isPortrait, localPolish } = module.exports;

assert.equal(isPortrait("MOCK"), false);
assert.equal(isPortrait(""), false);
assert.equal(isPortrait(undefined), false);
assert.equal(isPortrait("ref://0"), false);
assert.equal(isPortrait("data:image/svg+xml;base64,abc"), true);
assert.equal(isPortrait("https://cdn.example/a.jpg"), true);

const once = localPolish("圣诞快乐！", "zh");
assert.equal(once, "圣诞快乐！\n永远爱你。");
assert.equal(localPolish(once, "zh"), once);
assert.equal(localPolish("  ", "en"), "With love, always.");

console.log("guards ok");
