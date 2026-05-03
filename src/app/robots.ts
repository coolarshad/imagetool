export const dynamic = 'force-static';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://imagetoollab.com'; // Ensure this matches your actual production domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Disallow API routes from being crawled if you add any
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
