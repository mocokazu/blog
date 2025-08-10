
import PublicPostList from '@/components/blog/PublicPostList';

const BlogPage = async () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Blog</h1>
      <PublicPostList />
    </div>
  );
};

export default BlogPage;
