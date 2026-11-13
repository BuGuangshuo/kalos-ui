import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../components/ui/kalos-avatar-shared.tsx", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } });
const { avatarInitials, avatarCount, avatarHash, avatarLabel } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("initials preserve Chinese, accented characters and complete emoji graphemes", () => {
  assert.equal(avatarInitials("林舟"), "林舟");
  assert.equal(avatarInitials("  Álvaro Cruz  "), "ÁC");
  assert.equal(avatarInitials("Christopher Montgomery III"), "CM");
  assert.equal(avatarInitials("👩🏽‍💻 Lin"), "👩🏽‍💻");
  assert.equal(avatarInitials("🇨🇳 Lin"), "🇨🇳");
  assert.equal(avatarInitials(" "), "");
});

test("group counts clamp invalid inputs and support a count-only group", () => {
  assert.equal(avatarCount(0, 4), 0);
  assert.equal(avatarCount(-2, 4), 0);
  assert.equal(avatarCount(2.8, 4), 2);
  assert.equal(avatarCount(NaN, 4), 4);
  assert.equal(avatarCount(Infinity, 4), 4);
});

test("stable seeds produce repeatable colors and status remains in the accessible name", () => {
  assert.equal(avatarHash("contact-1"), avatarHash("contact-1"));
  assert.notEqual(avatarHash("contact-1"), avatarHash("contact-2"));
  assert.equal(avatarLabel("林舟", "busy"), "林舟，忙碌");
  assert.equal(avatarLabel("林舟"), "林舟");
  assert.equal(avatarLabel(), "");
});
