const EXTENSION_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  json: 'json',
  md: 'markdown',
  mdx: 'mdx',
  py: 'python',
  rs: 'rust',
  go: 'go',
  swift: 'swift',
  kt: 'kotlin',
  java: 'java',
  css: 'css',
  scss: 'scss',
  html: 'html',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  rb: 'ruby',
  php: 'php',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  hpp: 'cpp',
  cs: 'csharp',
  vue: 'vue',
  svelte: 'svelte',
};

export function languageFromPath(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_MAP[ext] ?? 'text';
}
