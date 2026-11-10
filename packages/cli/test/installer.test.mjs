import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInstallPlan, install } from "../lib/installer.mjs";

async function project(t, { framework = "react", style, manager = "npm" } = {}) {
  const cwd = await mkdtemp(join(tmpdir(), "kalos-cli-test-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFile(join(cwd, "package.json"), JSON.stringify({
    name: "consumer",
    packageManager: `${manager}@1.0.0`,
    dependencies: { [framework]: "latest" },
  }));
  if (style) await writeFile(join(cwd, "components.json"), JSON.stringify({ style, aliases: { ui: "@/my-ui" } }));
  return cwd;
}

for (const [base, backend] of [["radix", "radix"], ["base", "base-ui"], ["aria", "react-aria"]]) {
  test(`new React project selects ${base} before initialization and installation`, async (t) => {
    const cwd = await project(t);
    let prompted = false;
    const plan = await createInstallPlan({ cwd, registry: "http://localhost:3000" }, {
      interactive: true,
      choose: async (question) => {
        prompted = true;
        assert.deepEqual(question.choices.map((choice) => choice.value), ["radix", "base", "aria"]);
        return base;
      },
    });
    assert.ok(prompted);
    assert.equal(plan.commands.length, 2);
    assert.deepEqual(plan.commands[0].args.slice(2, 5), ["init", "--base", base]);
    assert.ok(plan.commands[1].args.includes(`http://localhost:3000/r/${backend}/kalos-all.json`));
    await assert.rejects(access(join(cwd, "components.json")));
  });
}

test("configured projects preserve theme and aliases and only add requested components", async (t) => {
  const cwd = await project(t, { style: "aria-nova", manager: "pnpm" });
  const before = await readFile(join(cwd, "components.json"), "utf8");
  const plan = await createInstallPlan({ cwd, components: ["button", "kalos-card"], yes: true }, {
    interactive: true,
    choose: async ({ initial }) => { assert.equal(initial, 2); return "aria"; },
  });
  assert.equal(plan.commands.length, 1);
  assert.equal(plan.commands[0].command, "pnpm");
  assert.ok(plan.commands[0].args.includes("--yes"));
  assert.ok(plan.commands[0].args.some((arg) => arg.endsWith("/react-aria/kalos-button.json")));
  assert.ok(plan.commands[0].args.some((arg) => arg.endsWith("/react-aria/kalos-card.json")));
  assert.equal(await readFile(join(cwd, "components.json"), "utf8"), before);
});

test("a conflicting selection stops before running commands or modifying configuration", async (t) => {
  const cwd = await project(t, { style: "radix-nova" });
  const before = await readFile(join(cwd, "components.json"), "utf8");
  await assert.rejects(install({ cwd, base: "base" }, {
    interactive: false,
    run: async () => assert.fail("must not install into a different configured base"),
  }), /当前项目已配置 Radix UI/);
  assert.equal(await readFile(join(cwd, "components.json"), "utf8"), before);
});

test("noninteractive installs require an explicit base for a new React project", async (t) => {
  const cwd = await project(t);
  await assert.rejects(createInstallPlan({ cwd, yes: true }, { interactive: false }), /--base/);
});

test("noninteractive installs reuse a configured base", async (t) => {
  const cwd = await project(t, { style: "base-nova" });
  const plan = await createInstallPlan({ cwd }, { interactive: false });
  assert.equal(plan.base, "base");
  assert.equal(plan.commands.length, 1);
});

test("cancelling the library selector does not launch an installer", async (t) => {
  const cwd = await project(t);
  await assert.rejects(install({ cwd }, {
    interactive: true,
    choose: async () => { throw Object.assign(new Error("cancelled"), { code: "CANCELLED" }); },
    run: async () => assert.fail("must not install after cancellation"),
  }), { code: "CANCELLED" });
  await assert.rejects(access(join(cwd, "components.json")));
});

test("Vue is detected and installs from Reka's Vue registry without a React base prompt", async (t) => {
  const cwd = await project(t, { framework: "vue" });
  const plan = await createInstallPlan({ cwd }, {
    interactive: true,
    choose: async () => assert.fail("Vue has one supported base"),
  });
  assert.equal(plan.base, "reka");
  assert.ok(plan.commands[0].args.includes("reka-nova"));
  assert.ok(plan.commands[1].args.includes("shadcn-vue@latest"));
  assert.ok(plan.commands[1].args.some((arg) => arg.endsWith("/vue/kalos-all.json")));
});

test("dry-run only describes actions, including when the project path contains spaces", async (t) => {
  const directory = await project(t);
  const cwd = join(directory, "my app");
  const { mkdir, copyFile } = await import("node:fs/promises");
  await mkdir(cwd);
  await copyFile(join(directory, "package.json"), join(cwd, "package.json"));
  const output = [];
  const plan = await install({ cwd, base: "radix", dryRun: true }, {
    interactive: false,
    run: async () => assert.fail("dry-run must not spawn commands"),
    log: (line) => output.push(line),
  });
  assert.equal(plan.cwd, cwd);
  assert.ok(output.at(-1).includes("未修改项目"));
  await assert.rejects(access(join(cwd, "components.json")));
});

test("unknown components and invalid registry addresses fail before installation", async (t) => {
  const cwd = await project(t);
  await assert.rejects(createInstallPlan({ cwd, base: "base", components: ["not-a-component"] }), /未知组件/);
  await assert.rejects(createInstallPlan({ cwd, base: "base", registry: "file:///tmp/components" }), /http/);
});
