import ArticleCard from './ArticleCard';
import Pagination from './Pagination';

type Article = {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
  readTime: string;
  tags?: string[];
  slug: string;
};

type ArticleListProps = {
  articles: Article[];
  currentPage?: number;
  totalPages?: number;
  basePath?: string;
};

export default function ArticleList({
  articles,
  currentPage = 1,
  totalPages = 1,
  basePath = '/blog',
}: ArticleListProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={basePath}
          />
        </div>
      )}
    </div>
  );
}
