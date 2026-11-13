import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInstallPlan, detectFramework, install, selectMode } from "../lib/installer.mjs";

async function project(t, { framework = "next", style, manager = "npm", dependencies, config = {} } = {}) {
  const cwd = await mkdtemp(join(tmpdir(), "kalos-cli-test-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFile(join(cwd, "package.json"), JSON.stringify({
    name: "consumer",
    packageManager: `${manager}@1.0.0`,
    dependencies: dependencies ?? { [framework]: "latest" },
  }));
  if (style) await writeFile(join(cwd, "components.json"), JSON.stringify({ style, aliases: { ui: "@/my-ui" }, ...config }));
  return cwd;
}

test("interactive and noninteractive installs default to Base UI without a library prompt", async t => {
  const cwd = await project(t);
  for (const interactive of [true, false]) {
    const plan = await createInstallPlan({ cwd, registry: "http://localhost:3000" }, {
      interactive, choose: () => assert.fail("must not prompt for a primitive"),
    });
    assert.equal(plan.base, "base");
    assert.equal(plan.commands.length, 2);
    assert.deepEqual(plan.commands[0].args.slice(2, 5), ["init", "--base", "base"]);
    assert.ok(plan.commands[1].args.includes("http://localhost:3000/r/kalos-all.json"));
    await assert.rejects(access(join(cwd, "components.json")));
  }
});

test("configured Base UI projects preserve theme and aliases and only add requested components", async t => {
  const cwd = await project(t, { style: "base-nova", manager: "pnpm" });
  const before = await readFile(join(cwd, "components.json"), "utf8");
  const plan = await createInstallPlan({ cwd, components: ["button", "kalos-card"], yes: true }, {
    interactive: true, choose: () => assert.fail("must not prompt for a primitive"),
  });
  assert.equal(plan.commands.length, 1);
  assert.equal(plan.commands[0].command, "pnpm");
  assert.ok(plan.commands[0].args.includes("--yes"));
  assert.ok(plan.commands[0].args.some(arg => arg.endsWith("/r/kalos-button.json")));
  assert.ok(plan.commands[0].args.some(arg => arg.endsWith("/r/kalos-card.json")));
  assert.equal(await readFile(join(cwd, "components.json"), "utf8"), before);
});

for (const [style, label] of [["radix-nova", "Radix UI"], ["new-york", "Radix UI"], ["aria-nova", "React Aria"]]) {
  test(`retired ${style} configuration is rejected before commands run`, async t => {
    const cwd = await project(t, { style });
    const before = await readFile(join(cwd, "components.json"), "utf8");
    await assert.rejects(install({ cwd }, { interactive: false, run: () => assert.fail("must not install") }), new RegExp(label));
    assert.equal(await readFile(join(cwd, "components.json"), "utf8"), before);
  });
}

for (const base of ["radix", "aria", "react-aria", "unknown"]) {
  test(`retired or invalid --base ${base} is rejected for both modes`, async t => {
    const cwd = await project(t);
    for (const mode of ["init", "add"]) {
      await assert.rejects(install({ mode, cwd, template: mode === "init" ? "vite" : undefined, name: mode === "init" ? "new-app" : undefined, base }, { interactive: false, run: () => assert.fail("must not install") }), /仅支持 Base UI/);
    }
  });
}

test("unrecognized existing component configuration is not silently migrated", async t => {
  const cwd = await project(t, { style: "custom" });
  await assert.rejects(createInstallPlan({ cwd }), /无法确认/);
});

const integrations = [
  ["next", { react: "latest", next: "latest" }],
  ["vite", { react: "latest", vite: "latest", "@vitejs/plugin-react": "latest" }],
  ["react-router", { react: "latest", vite: "latest", "react-router": "latest", "@react-router/dev": "latest" }],
];

for (const [framework, dependencies] of integrations) {
  for (const [base] of [["base", "base-ui"]]) {
    test(`${framework} initializes and installs ${base} with the matching template`, async (t) => {
      const cwd = await project(t, { dependencies });
      const plan = await createInstallPlan({ cwd, base, components: ["button", "dialog"] }, { interactive: false });
      assert.equal(plan.framework, framework);
      assert.equal(plan.base, base);
      assert.equal(plan.commands.length, 2);
      assert.ok(plan.commands.every(command => command.args.includes("shadcn@latest")));
      const init = plan.commands[0].args;
      assert.equal(init[init.indexOf("--template") + 1], framework);
      assert.equal(init[init.indexOf("--preset") + 1], "nova");
      assert.ok(plan.commands[1].args.some(arg => arg.endsWith(`/r/kalos-button.json`)));
      assert.ok(plan.commands[1].args.some(arg => arg.endsWith(`/r/kalos-dialog.json`)));
      await assert.rejects(access(join(cwd, "components.json")));
    });
  }

  test(`${framework} preserves a configured project's aliases, CSS path, RSC and base`, async (t) => {
    const cwd = await project(t, {
      dependencies,
      style: "base-nova",
      config: { rsc: framework === "next", aliases: { ui: "~/shared/ui" }, tailwind: { css: "app/app.css" } },
    });
    const before = await readFile(join(cwd, "components.json"), "utf8");
    let ran = 0;
    await install({ cwd, components: ["input"] }, {
      interactive: false,
      log() {},
      run: async ({ args }, directory) => {
        ran++;
        assert.equal(directory, cwd);
        assert.ok(args.includes("add"));
        assert.ok(!args.includes("init"));
        assert.ok(args.some(arg => arg.endsWith("/r/kalos-input.json")));
      },
    });
    assert.equal(ran, 1);
    assert.equal(await readFile(join(cwd, "components.json"), "utf8"), before);
    await assert.rejects(createInstallPlan({ cwd, base: "radix" }), /仅支持 Base UI/);
  });
}

test("detection handles SWC, router library mode and peer dependencies without classifying every Vite project as React", () => {
  assert.equal(detectFramework({ devDependencies: { "@vitejs/plugin-react-swc": "latest" } }), "vite");
  assert.equal(detectFramework({ dependencies: { react: "latest", "react-router-dom": "latest" } }), "react-router");
  assert.equal(detectFramework({ peerDependencies: { react: "latest", next: "latest" } }), "next");
  assert.equal(detectFramework({ peerDependencies: { react: "latest" } }), undefined);
  assert.equal(detectFramework({ dependencies: { react: "latest", next: "latest", "react-router": "latest" } }), "next");
  assert.equal(detectFramework({ devDependencies: { vite: "latest", "@vitejs/plugin-vue": "latest" } }), undefined);
  assert.equal(detectFramework({ devDependencies: { vite: "latest" } }), undefined);
});

for (const framework of ["next", "vite", "react-router"]) {
  test(`--framework ${framework} supports projects with dependencies managed outside the package`, async (t) => {
    const cwd = await project(t, { dependencies: {} });
    const plan = await createInstallPlan({ cwd, framework, base: "base" }, { interactive: false });
    assert.equal(plan.framework, framework);
  });
}

for (const framework of ["vue", "nuxt"]) {
  test(`${framework} projects are rejected before prompting or running commands, including with an override`, async (t) => {
    const cwd = await project(t, { framework });
    for (const override of [undefined, "vite"]) {
      await assert.rejects(install({ cwd, framework: override, base: "base" }, {
        interactive: true,
        choose: async () => assert.fail("unsupported projects must not prompt"),
        run: async () => assert.fail("unsupported projects must not install"),
      }), /不再支持 Vue/);
    }
    await assert.rejects(access(join(cwd, "components.json")));
  });
}

test("retired configuration and unsupported framework flags cannot install React over another framework", async (t) => {
  const retired = await project(t, { style: "reka-nova" });
  await assert.rejects(createInstallPlan({ cwd: retired, framework: "vite", base: "base" }), /不再支持 Vue/);
  const cwd = await project(t);
  for (const framework of ["react", "vue", "svelte", "start", "laravel", "astro"]) {
    await assert.rejects(createInstallPlan({ cwd, framework, base: "base" }), /--framework 仅支持/);
  }
});

test("dry-run only describes actions, including when the project path contains spaces", async (t) => {
  const directory = await project(t);
  const cwd = join(directory, "my app");
  const { mkdir, copyFile } = await import("node:fs/promises");
  await mkdir(cwd);
  await copyFile(join(directory, "package.json"), join(cwd, "package.json"));
  const output = [];
  const plan = await install({ cwd, base: "base", dryRun: true }, {
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

for (const template of ["next", "vite", "react-router"]) {
  for (const [base] of [["base", "base-ui"]]) {
    test(`init creates a ${template} / ${base} plan with the full library and theme`, async (t) => {
      const cwd = await project(t);
      const plan = await createInstallPlan({ mode: "init", cwd, template, base, name: "my-app", registry: "http://localhost:3000" }, { interactive: false });
      assert.equal(plan.mode, "init");
      assert.equal(plan.projectDir, join(cwd, "my-app"));
      assert.equal(plan.framework, template);
      assert.equal(plan.commands.length, 1);
      const args = plan.commands[0].args;
      assert.equal(args[args.indexOf("--name") + 1], "my-app");
      assert.equal(args[args.indexOf("--template") + 1], template);
      assert.ok(args.includes("--no-monorepo"));
      assert.ok(args.includes("--no-reinstall"));
      assert.ok(!args.includes("--force"));
      assert.ok(args.includes(`http://localhost:3000/r/kalos-all.json`));
      assert.ok(args.includes(`http://localhost:3000/r/kalos-theme.json`));
      await assert.rejects(access(plan.projectDir));
    });
  }
}

test("interactive init collects scaffold, project name and package manager before writing anything", async (t) => {
  const cwd = await project(t);
  const questions = [];
  const plan = await createInstallPlan({ mode: "init", cwd }, {
    interactive: true,
    choose: async question => {
      questions.push(question.message);
      if (question.message === "选择前端脚手架") assert.deepEqual(question.choices.map(choice => choice.value), ["next", "vite", "react-router"]);
      return { "选择前端脚手架": "vite", "选择包管理器": "pnpm" }[question.message];
    },
    input: async question => { questions.push(question.message); return "my-project"; },
  });
  assert.deepEqual(questions, ["选择前端脚手架", "项目名称", "选择包管理器"]);
  assert.equal(plan.commands[0].command, "pnpm");
  assert.equal(plan.base, "base");
  assert.deepEqual(await readdir(cwd), ["package.json"]);
});

test("init stages the new scaffold separately and moves it without modifying the parent project", async (t) => {
  const cwd = await project(t, { style: "radix-nova" });
  const before = await readFile(join(cwd, "components.json"), "utf8");
  const plan = await install({ mode: "init", cwd, template: "vite", base: "base", name: "new-app", yes: true }, {
    interactive: false,
    log() {},
    run: async ({ args }, workingDirectory) => {
      assert.notEqual(workingDirectory, cwd);
      assert.ok(workingDirectory.startsWith(join(cwd, ".kalos-init-")));
      const target = join(workingDirectory, args[args.indexOf("--name") + 1]);
      await mkdir(target);
      await writeFile(join(target, "package.json"), JSON.stringify({ name: "new-app" }));
      await writeFile(join(target, "components.json"), JSON.stringify({ style: "base-nova" }));
    },
  });
  assert.equal(JSON.parse(await readFile(join(plan.projectDir, "package.json"), "utf8")).name, "new-app");
  assert.equal(await readFile(join(cwd, "components.json"), "utf8"), before);
  assert.ok(!(await readdir(cwd)).some(name => name.startsWith(".kalos-init-")));
});

test("init refuses existing destinations and invalid names without launching commands", async (t) => {
  const cwd = await project(t);
  const options = { mode: "init", cwd, template: "vite", base: "base" };
  for (const name of ["../outside", "/tmp/elsewhere", ".", "..", "two words", "UPPERCASE", "node_modules"]) {
    await assert.rejects(createInstallPlan({ ...options, name }), /项目名/);
  }
  await mkdir(join(cwd, "existing"));
  await writeFile(join(cwd, "existing", "keep.txt"), "user data");
  await assert.rejects(install({ ...options, name: "existing" }, { run: () => assert.fail("must not overwrite a destination") }), /已存在/);
  assert.equal(await readFile(join(cwd, "existing", "keep.txt"), "utf8"), "user data");
});

test("failed init cleans its staging files and never creates the requested project", async (t) => {
  const cwd = await project(t);
  await assert.rejects(install({ mode: "init", cwd, template: "vite", base: "base", name: "my-app" }, {
    interactive: false,
    log() {},
    run: async (_command, directory) => {
      await writeFile(join(directory, "partial.txt"), "partial scaffold");
      throw new Error("scaffold failed");
    },
  }), /scaffold failed/);
  assert.deepEqual(await readdir(cwd), ["package.json"]);
});

test("init dry-run and cancellation leave the filesystem unchanged", async (t) => {
  const cwd = await project(t);
  await install({ mode: "init", cwd, template: "react-router", base: "base", name: "my-app", dryRun: true }, {
    interactive: false, log() {}, run: () => assert.fail("dry-run must not run"),
  });
  await assert.rejects(install({ mode: "init", cwd }, {
    interactive: true,
    choose: async () => { throw Object.assign(new Error("cancelled"), { code: "CANCELLED" }); },
    run: () => assert.fail("cancellation must not run"),
  }), { code: "CANCELLED" });
  assert.deepEqual(await readdir(cwd), ["package.json"]);
});

test("noninteractive init requires explicit scaffold and project name", async (t) => {
  const cwd = await project(t);
  await assert.rejects(createInstallPlan({ mode: "init", cwd }, { interactive: false }), /--template/);
  await assert.rejects(createInstallPlan({ mode: "init", cwd, template: "vite" }, { interactive: false }), /--name/);
  await assert.rejects(createInstallPlan({ mode: "init", cwd, template: "vite", base: "base" }, { interactive: false }), /--name/);
  await assert.rejects(createInstallPlan({ mode: "init", cwd, template: "vue", base: "base", name: "my-app" }, { interactive: false }), /--template/);
});

test("add never scaffolds a project in an empty directory", async (t) => {
  const cwd = await project(t);
  await rm(join(cwd, "package.json"));
  await assert.rejects(install({ mode: "add", cwd, framework: "vite", base: "base" }, { run: () => assert.fail("add must not create a project") }), /已有 React 项目/);
  assert.deepEqual(await readdir(cwd), []);
});

test("the default entry offers exactly two installation modes and preserves noninteractive add", async (t) => {
  const cwd = await project(t);
  assert.equal(await selectMode({ cwd }, { interactive: false }), "add");
  assert.equal(await selectMode({ cwd }, {
    interactive: true,
    choose: async ({ choices, initial }) => {
      assert.deepEqual(choices.map(choice => choice.value), ["init", "add"]);
      assert.equal(initial, 1);
      return "init";
    },
  }), "init");
  await rm(join(cwd, "package.json"));
  await assert.rejects(selectMode({ cwd }, { interactive: false }), /init/);
});

test("unsupported frameworks cannot be detected as Vite or installed through an override", async (t) => {
  for (const dependency of ["@tanstack/react-start", "laravel-vite-plugin", "astro"]) {
    const dependencies = { react: "latest", vite: "latest", "@vitejs/plugin-react": "latest", [dependency]: "latest" };
    assert.equal(detectFramework({ dependencies }), undefined);
    const cwd = await project(t, { dependencies, style: "radix-nova" });
    const before = await readFile(join(cwd, "components.json"), "utf8");
    for (const framework of [undefined, "vite"]) {
      await assert.rejects(install({ cwd, framework, base: "base" }, {
        interactive: true,
        choose: () => assert.fail("unsupported projects must not prompt"),
        run: () => assert.fail("unsupported projects must not install"),
      }), /仅支持 Next.js、Vite 和 React Router/);
    }
    assert.equal(await readFile(join(cwd, "components.json"), "utf8"), before);
  }
});

test("init refuses unsupported scaffold flags without creating a project", async (t) => {
  const cwd = await project(t);
  for (const template of ["react", "start", "laravel", "astro"]) {
    await assert.rejects(install({ mode: "init", cwd, template, base: "base", name: "my-app" }, {
      interactive: false,
      run: () => assert.fail("unsupported templates must not run"),
    }), /--template next、vite 或 react-router/);
  }
  assert.deepEqual(await readdir(cwd), ["package.json"]);
});
