/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  // 管理者関連ページをクロール対象から除外
  exclude: ['/admin-login', '/dashboard', '/dashboard/**', '/api/**'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin-login', '/dashboard', '/api'],
      },
    ],
    additionalSitemaps: [],
  },
  // 優先度設定
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  // ブログ記事は動的に生成
  outDir: './public',
}
