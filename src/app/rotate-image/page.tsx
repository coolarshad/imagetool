import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('rotate');
  const content = data || TOOL_CONTENT['rotate'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
    alternates: { canonical: '/rotate-image' },
  };
}

export default async function RotatePage() {
  const data = await getPageContent('rotate');
  const content = data || TOOL_CONTENT['rotate'];

  return <ToolLayout activeTool="rotate" content={content} />;
}
