import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// SEO helper: adds canonical / og:url / absolute share-image URLs and emits
// sitemap.xml + robots.txt. Set VITE_SITE_URL (e.g. https://asadali.dev) in .env
const seo = (siteUrl, env = {}) => ({
  name: 'portfolio-seo',
  transformIndexHtml(html) {
    const tags = siteUrl
      ? [
          `<link rel="canonical" href="${siteUrl}/" />`,
          `<meta property="og:url" content="${siteUrl}/" />`,
          `<meta property="og:image" content="${siteUrl}/og-image.jpg" />`,
          `<meta name="twitter:image" content="${siteUrl}/og-image.jpg" />`,
        ].join('\n    ')
      : '';
    const verify = [
      env.VITE_GOOGLE_SITE_VERIFICATION && `<meta name="google-site-verification" content="${env.VITE_GOOGLE_SITE_VERIFICATION}" />`,
      env.VITE_BING_SITE_VERIFICATION && `<meta name="msvalidate.01" content="${env.VITE_BING_SITE_VERIFICATION}" />`,
    ].filter(Boolean).join('\n    ');
    return html
      .replace('<!--SEO_URL-->', tags)
      .replace('<!--SEO_VERIFY-->', verify)
      .replace('<link rel="alternate" hreflang="en" href="/" />', siteUrl ? `<link rel="alternate" hreflang="en" href="${siteUrl}/" />` : '');
  },
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'robots.txt',
      source: `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`,
    });
    if (siteUrl) {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n  <url><loc>${siteUrl}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority><image:image><image:loc>${siteUrl}/og-image.jpg</image:loc></image:image></url>\n</urlset>\n`,
      });
    }
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '');
  return { plugins: [react(), tailwindcss(), seo(siteUrl, env)] };
});
