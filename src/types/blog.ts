export interface Author {
  id: string;
  email: string;
  full_name?: string;
  name?: string; // エイリアス
  avatar_url?: string;
  avatar?: string; // エイリアス
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  featured_image?: string; // エイリアス
  status: 'draft' | 'published' | 'archived';
  is_premium: boolean;
  author_id: string;
  category_id?: string;
  published_at?: string;
  reading_time: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  created_at: string;
  updated_at: string;
  
  // Relations
  author?: Author;
  category?: Category;
  tags?: Tag[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  article_id: string;
  author_id?: string;
  author_name?: string;
  author_email?: string;
  parent_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  
  // Relations
  author?: Author;
  replies?: Comment[];
}

export interface ArticleView {
  id: string;
  article_id: string;
  user_id?: string;
  ip_address: string;
  user_agent: string;
  viewed_at: string;
}

export interface ArticleLike {
  id: string;
  article_id: string;
  user_id: string;
  created_at: string;
}
