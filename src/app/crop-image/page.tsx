import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('crop');
  const content = data || TOOL_CONTENT['crop'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
    alternates: { canonical: '/crop-image' },
  };
}

export default async function CropPage() {
  const data = await getPageContent('crop');
  const content = data || TOOL_CONTENT['crop'];

  return <ToolLayout activeTool="crop" content={content} />;
}
