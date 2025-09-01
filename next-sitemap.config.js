/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://outfitrater.online',
  generateRobotstxt: true, // Generate robots.txt
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 1.0,
  exclude: [
    '/api/*', // Exclude API routes
    '/_next/*', // Exclude Next.js build files
    '/404', // Exclude 404 page
    '/500', // Exclude 500 page
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/_next/',
          '/api/',
          '/.next/',
        ],
      },
    ],
    additionalSitemaps: [
      'https://outfitrater.online/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path, // URL
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    }
  },
}
