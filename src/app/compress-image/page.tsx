import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('compress');
  const content = data || TOOL_CONTENT['compress'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
    alternates: { canonical: '/compress-image' },
  };
}

export default async function CompressPage() {
  const data = await getPageContent('compress');
  const content = data || TOOL_CONTENT['compress'];

  return <ToolLayout activeTool="compress" content={content} />;
}
