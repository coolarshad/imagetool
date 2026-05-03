import { ToolLayout } from '@/components/ToolLayout';
import { getPageContent } from '@/lib/firebase';
import { TOOL_CONTENT } from '@/lib/constants';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageContent('pixelate');
  const content = data || TOOL_CONTENT['pixelate'];
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.desc,
    alternates: { canonical: '/pixelate-image' },
  };
}

export default async function PixelatePage() {
  const data = await getPageContent('pixelate');
  const content = data || TOOL_CONTENT['pixelate'];

  return <ToolLayout activeTool="pixelate" content={content} />;
}
