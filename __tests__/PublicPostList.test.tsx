import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PublicPostList from '@/components/blog/PublicPostList';

jest.mock('@/services/postService', () => ({
  getPosts: jest.fn(async () => [
    {
      id: '1',
      title: 'First Post',
      content: 'hello world',
      slug: 'first-post',
      excerpt: 'greeting',
      published: true,
      publishedAt: new Date('2024-05-01'),
      updatedAt: new Date('2024-05-01'),
      authorId: 'u1',
      authorName: 'User',
      authorEmail: 'u@example.com',
      tags: ['news'],
    },
    {
      id: '2',
      title: 'Next.js Guide',
      content: 'router and link',
      slug: 'next-guide',
      excerpt: 'learn next',
      published: true,
      publishedAt: new Date('2024-06-10'),
      updatedAt: new Date('2024-06-10'),
      authorId: 'u1',
      authorName: 'User',
      authorEmail: 'u@example.com',
      tags: ['tech', 'next'],
    },
  ]),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => '/blog',
}));

describe('PublicPostList (smoke)', () => {
  it('renders posts after loading', async () => {
    render(<PublicPostList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // wait for posts to appear
    await waitFor(() => expect(screen.getByText('Next.js Guide')).toBeInTheDocument());
    expect(screen.getByText('First Post')).toBeInTheDocument();
  });
});
