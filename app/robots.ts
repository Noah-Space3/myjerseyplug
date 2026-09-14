import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/account', '/order/', '/api/'],
    },
    sitemap: `https://${SITE.domain}/sitemap.xml`,
    host: `https://${SITE.domain}`,
  };
}
