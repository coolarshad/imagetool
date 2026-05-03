import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('blackwhite');
  const content = data || TOOL_CONTENT['blackwhite'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
    alternates: { canonical: '/blackwhite-image' },
  };
}

export default async function BlackwhitePage() {
  const data = await getPageContent('blackwhite');
  const content = data || TOOL_CONTENT['blackwhite'];

  return <ToolLayout activeTool="blackwhite" content={content} />;
}
