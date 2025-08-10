import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';

type ArticleCardProps = {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
  readTime: string;
  tags?: string[];
  slug: string;
};

export default function ArticleCard({
  id,
  title,
  excerpt,
  coverImage,
  date,
  readTime,
  tags = [],
  slug,
}: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {coverImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <div className="flex items-center mr-4">
            <Calendar className="w-4 h-4 mr-1" />
            <time dateTime={date}>{new Date(date).toLocaleDateString('ja-JP')}</time>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{readTime} 分で読める</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-2 hover:text-primary-600 transition-colors">
          <Link href={`/blog/${slug}`}>
            {title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={`${id}-${tag}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
