export const dynamic = 'force-static';
import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://imagetoollab.com'; // Ensure this matches your actual production domain

  // Static routes
  const routes = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
    '/blog',
    '/resize-image',
    '/crop-image',
    '/mirror-image',
    '/rotate-image',
    '/compress-image',
    '/convert-image',
    '/watermark-image',
    '/metadata-image',
    '/pixelate-image',
    '/blackwhite-image'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await getArticles();
    blogRoutes = articles.map((article: any) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Failed to generate sitemap for blog articles', error);
  }

  return [...routes, ...blogRoutes];
}
