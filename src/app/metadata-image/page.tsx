import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('metadata');
  const content = data || TOOL_CONTENT['metadata'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
    alternates: { canonical: '/metadata-image' },
  };
}

export default async function MetadataPage() {
  const data = await getPageContent('metadata');
  const content = data || TOOL_CONTENT['metadata'];

  return <ToolLayout activeTool="metadata" content={content} />;
}
