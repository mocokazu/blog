/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14では不要
  // experimental: {
  //   appDir: true,
  // },
  images: {
    domains: ['localhost', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config, { isServer }) => {
    // Three.js関連の設定
    config.module.rules.push({
      test: /\.(glb|gltf|vrm)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/models/',
          outputPath: 'static/models/',
        },
      },
    });

    // Live2D関連の設定
    config.module.rules.push({
      test: /\.(moc3|model3)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/live2d/',
          outputPath: 'static/live2d/',
        },
      },
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
