import fs from 'fs';
import path from 'path';

const tools = [
  'resize', 'crop', 'mirror', 'rotate', 'compress', 'convert', 
  'pixelate', 'blackwhite', 'watermark', 'metadata'
];

for (const tool of tools) {
  const dir = path.join(process.cwd(), 'src', 'app', `${tool}-image`);
  fs.mkdirSync(dir, { recursive: true });

  const content = `import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('${tool}');
  const content = data || TOOL_CONTENT['${tool}'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
  };
}

export default async function ${tool.charAt(0).toUpperCase() + tool.slice(1)}Page() {
  const data = await getPageContent('${tool}');
  const content = data || TOOL_CONTENT['${tool}'];

  return <ToolLayout activeTool="${tool}" content={content} />;
}
`;

  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
}
