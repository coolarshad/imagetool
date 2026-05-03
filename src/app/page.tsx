import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('resize');
  const content = data || TOOL_CONTENT['resize'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
  };
}

export default async function HomePage() {
  const data = await getPageContent('resize');
  const content = data || TOOL_CONTENT['resize'];

  return <ToolLayout activeTool="resize" content={content} />;
}
