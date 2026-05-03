import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('watermark');
  const content = data || TOOL_CONTENT['watermark'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
    alternates: { canonical: '/watermark-image' },
  };
}

export default async function WatermarkPage() {
  const data = await getPageContent('watermark');
  const content = data || TOOL_CONTENT['watermark'];

  return <ToolLayout activeTool="watermark" content={content} />;
}
