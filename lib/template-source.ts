// Match the source import aliases that shadcn rewrites for each host.
export function templateFileTarget(sourcePath: string) {
  return sourcePath.replace(/^components\/ui\//, "@ui/").replace(/^components\//, "@components/")
    .replace(/^registry\/kalos\//, "@components/").replace(/^lib\//, "@lib/").replace(/^hooks\//, "@hooks/");
}

export function templateSourceFile(file: { target: string; content: string }) {
  const path = file.target.replace(/^@ui\//, "components/ui/").replace(/^@(components|hooks|lib)\//, "$1/");
  const content = /\.tsx?$/.test(path)
    ? file.content.replaceAll('"@/registry/kalos/', '"@/components/').replaceAll("'@/registry/kalos/", "'@/components/")
    : file.content;
  return { path, content };
}
