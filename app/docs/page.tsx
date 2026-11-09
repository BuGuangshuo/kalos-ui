import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar, CodeBlock } from "@/components/docs-parts";
import { InstallCommand } from "@/components/site-shell";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
export const metadata: Metadata = { title: "Documentation" };
export default function DocsPage() {
  return (
    <div className="page-width docs-layout">
      <Sidebar active="docs" />
      <article className="docs-content">
        <span className="section-eyebrow">GETTING STARTED</span>
        <h1>A little setup. A lot of possibility.</h1>
        <p className="lead">
          Pop UI is a personal component registry built on shadcn/ui. Install
          the pieces you need as real source files. Every little detail is yours
          to change.
        </p>
        <section>
          <h2>What’s inside</h2>
          <p>
            Twelve React components with TypeScript, Tailwind CSS v4, and
            accessible Radix UI primitives. Each component includes a working
            preview, its full source, and a one-command install.
          </p>
        </section>
        <section id="installation">
          <h2>Up and running</h2>
          <h3>01 · Start with shadcn/ui</h3>
          <p>
            Use an existing React project with Tailwind CSS, or create a Next.js
            app. Then initialize shadcn/ui:
          </p>
          <CodeBlock code={"npx shadcn@latest init --base radix"} />
          <h3>02 · Pick a component</h3>
          <p>
            Browse the <Link href="/components">collection</Link> and copy a
            component’s install command. The CLI installs its required shadcn
            primitives too.
          </p>
          <InstallCommand />
          <h3>03 · Bring it into your project</h3>
          <CodeBlock
            code={
              'import { PopButton } from "@/components/ui/pop-button"\n\nexport default function Example() {\n  return <PopButton>Make something good</PopButton>\n}'
            }
          />
          <Alert>
            <AlertTitle>A familiar foundation</AlertTitle>
            <AlertDescription>
              These components use the Radix version of shadcn/ui and Tailwind
              CSS v4. Start with a Radix shadcn project for matching component
              APIs.
            </AlertDescription>
          </Alert>
        </section>
        <section id="theming">
          <h2>Find your own colors.</h2>
          <p>
            Pop UI follows your existing semantic design tokens. For the green
            palette used here, install the optional Pop theme:
          </p>
          <InstallCommand slug="pop-theme" />
          <p>
            The theme supplies coordinated light and dark values. You can also
            edit the primary, background, foreground, border, and radius tokens
            in your global stylesheet.
          </p>
          <CodeBlock
            code={
              ":root {\n  --primary: #117766;\n  --primary-foreground: #ffffff;\n  --radius: 0.625rem;\n}"
            }
          />
        </section>
        <section id="your-registry">
          <h2>A registry you can keep growing.</h2>
          <p>
            The repository contains everything needed to maintain your own
            registry:
          </p>
          <CodeBlock
            code={
              "registry/pop/       # Your distributable components\nregistry.json       # Registry manifest\npublic/r/           # Built, installable JSON files\nlib/catalog.ts      # Website metadata and usage examples\ncomponents/demos.tsx # Interactive previews\napp/                # Website and documentation"
            }
          />
          <h3>Add your next component</h3>
          <ol>
            <li>
              Create a TypeScript component in <code>registry/pop/</code>.
            </li>
            <li>
              Add metadata, dependencies, and a usage example in{" "}
              <code>lib/catalog.ts</code>.
            </li>
            <li>
              Add its preview in <code>components/demos.tsx</code>.
            </li>
            <li>
              Run the build, commit, and push. Vercel deploys from GitHub.
            </li>
          </ol>
          <CodeBlock code={"npm run registry:build\nnpm run build"} />
          <p>
            The manifest and registry items are generated from the component
            catalog. The build embeds the exact component source and validates
            registry output before deployment.
          </p>
        </section>
        <section>
          <h2>Built with care. Shared freely.</h2>
          <p>
            Use Pop UI in personal and commercial projects under the MIT
            license. This is an independently built library, with layout
            inspiration from{" "}
            <a
              href="https://www.affectui.com/"
              target="_blank"
              rel="noreferrer"
            >
              Affect UI
            </a>
            . The component foundation is{" "}
            <a
              href="https://ui.shadcn.com/docs/registry"
              target="_blank"
              rel="noreferrer"
            >
              shadcn/ui
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
