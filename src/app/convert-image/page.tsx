import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('convert');
  const content = data || TOOL_CONTENT['convert'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
    alternates: { canonical: '/convert-image' },
  };
}

export default async function ConvertPage() {
  const data = await getPageContent('convert');
  const content = data || TOOL_CONTENT['convert'];

  return <ToolLayout activeTool="convert" content={content} />;
}
