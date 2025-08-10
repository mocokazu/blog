import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@/services/postService', () => ({
  __esModule: true,
  getPostBySlug: (slug: string) => Promise.resolve((global as any).__TEST_POST__),
}));

// Mock next/script to render a real <script> so we can inspect its content
jest.mock('next/script', () =>
  function Script(props: any) {
    // Pass through all props including dangerouslySetInnerHTML
    return React.createElement('script', props);
  }
);

// Mock ESM-only dependencies to avoid Jest transform issues
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('div', props, props.children),
}));
jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: () => null,
}));

// Use global variable to control mocked return
declare global {
  // eslint-disable-next-line no-var
  var __TEST_POST__: any;
}

describe('blog/[slug] metadata and JSON-LD', () => {
  const OLD_ENV = process.env;

  const ogImageUrls = (images: unknown): string[] => {
    if (!images) return [];
    const arr = Array.isArray(images) ? images : [images];
    return arr
      .map((img: any) => {
        if (!img) return '';
        if (typeof img === 'string') return img;
        if (typeof URL !== 'undefined' && img instanceof URL) return img.toString();
        if (typeof img.url === 'string') return img.url;
        return '';
      })
      .filter(Boolean) as string[];
  };

  const twitterImageUrls = (images: unknown): string[] => ogImageUrls(images);

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    (global as any).__TEST_POST__ = undefined;
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.clearAllMocks();
  });

  test('generateMetadata returns canonical and OG/Twitter images from featuredImage', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';

    const post = {
      slug: 'hello-world',
      title: 'Hello World',
      content: '# Title',
      excerpt: 'Excerpt',
      published: true,
      publishedAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
      authorId: 'u1',
      authorName: 'Author',
      authorEmail: 'a@example.com',
      tags: ['tag1'],
      category: '技術',
      featuredImage: '/images/cover.png',
      seoTitle: 'SEO Title',
      seoDescription: 'SEO Description',
      seoKeywords: ['k1', 'k2'],
    };

    (global as any).__TEST_POST__ = post;

    const mod = await import('@/app/blog/[slug]/page');
    const md = await mod.generateMetadata({ params: { slug: post.slug } });

    expect(md.title).toBe('SEO Title');
    expect(md.description).toBe('SEO Description');
    expect(md.alternates?.canonical).toBe('https://example.com/blog/hello-world');
    expect(md.openGraph?.url).toBe('https://example.com/blog/hello-world');
    expect(md.openGraph?.siteName).toBe('example.com');
    expect(ogImageUrls(md.openGraph?.images)).toContain('https://example.com/images/cover.png');
    expect(twitterImageUrls(md.twitter?.images)).toContain('https://example.com/images/cover.png');
  });

  test('generateMetadata uses default OG image when featuredImage is missing and env is set', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    process.env.NEXT_PUBLIC_OG_DEFAULT = '/og-default.png';

    const postNoImg = {
      slug: 'no-image',
      title: 'No Image',
      content: 'content',
      excerpt: '',
      published: true,
      publishedAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
      authorId: 'u1',
      authorName: 'Author',
      authorEmail: 'a@example.com',
      tags: [],
      category: 'その他',
      featuredImage: undefined,
      seoTitle: 'No Image SEO',
      seoDescription: 'Desc',
      seoKeywords: [],
    };

    (global as any).__TEST_POST__ = postNoImg;

    const mod = await import('@/app/blog/[slug]/page');
    const md = await mod.generateMetadata({ params: { slug: postNoImg.slug } });

    expect(ogImageUrls(md.openGraph?.images)).toContain('https://example.com/og-default.png');
    expect(twitterImageUrls(md.twitter?.images)).toContain('https://example.com/og-default.png');
  });

  test('PostPage renders JSON-LD script', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';

    const post = {
      slug: 'hello-world',
      title: 'Hello World',
      content: '# Title',
      excerpt: 'Excerpt',
      published: true,
      publishedAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
      authorId: 'u1',
      authorName: 'Author',
      authorEmail: 'a@example.com',
      tags: ['tag1'],
      category: '技術',
      featuredImage: '/images/cover.png',
      seoTitle: 'SEO Title',
      seoDescription: 'SEO Description',
      seoKeywords: ['k1', 'k2'],
    };

    (global as any).__TEST_POST__ = post;

    const mod = await import('@/app/blog/[slug]/page');
    const ui = await mod.default({ params: { slug: post.slug } } as any);
    const { container } = render(ui as unknown as React.ReactElement);

    const script = container.querySelector('#blog-post-jsonld');
    expect(script).toBeInTheDocument();
    expect(script?.textContent || '').toContain('BlogPosting');
    expect(script?.textContent || '').toContain('SEO Title');
  });
});
