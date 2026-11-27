import { getDashboardSourceFiles } from "@/components/templates/dashboard-source";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ["overview", "empty", "complete"].map((scope) => ({ scope }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ scope: string }> },
) {
  const { scope } = await params;
  if (scope === "overview" || scope === "empty") {
    return Response.json(await getDashboardSourceFiles(scope));
  }
  if (scope === "complete") {
    const files = await getDashboardSourceFiles();
    const body = files
      .map((file) =>
        [
          file.path,
          "```" + file.path.split(".").at(-1),
          file.content.trimEnd(),
          "```",
        ].join("\n"),
      )
      .join("\n\n");
    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(null, { status: 404 });
}
