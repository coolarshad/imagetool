import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('mirror');
  const content = data || TOOL_CONTENT['mirror'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
    alternates: { canonical: '/mirror-image' },
  };
}

export default async function MirrorPage() {
  const data = await getPageContent('mirror');
  const content = data || TOOL_CONTENT['mirror'];

  return <ToolLayout activeTool="mirror" content={content} />;
}
