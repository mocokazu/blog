import { supabase } from '@/lib/supabase';
import { Article, ArticleView, ArticleLike } from '@/types/blog';

export class ArticleService {
  constructor(private supabaseClient = supabase) {}

  /**
   * 公開記事一覧を取得
   */
  static async getPublishedArticles(options: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
  } = {}) {
    const { page = 1, limit = 10, category, tag, search } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*),
        tags:article_tags(tag:tags(*))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (category) {
      query = query.eq('category.slug', category);
    }

    if (tag) {
      query = query.contains('tags.slug', [tag]);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .returns<Article[]>();

    if (error) throw error;

    return {
      articles: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * スラッグで記事を取得
   */
  static async getArticleBySlug(slug: string, userId?: string) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*),
        tags:article_tags(tag:tags(*)),
        comments:comments(
          *,
          author:authors(*)
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;

    // ビュー数を増加
    if (data) {
      await this.incrementViewCount(data.id, userId);
    }

    return data as Article;
  }

  /**
   * プレミアム記事を取得（認証必須）
   */
  static async getPremiumArticle(slug: string, userId: string) {
    // ユーザーのサブスクリプション状態を確認
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan:subscription_plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      throw new Error('Premium subscription required');
    }

    return this.getArticleBySlug(slug, userId);
  }

  /**
   * 記事のビュー数を増加
   */
  static async incrementViewCount(articleId: string, userId?: string) {
    // ビューログを記録
    await supabase.from('article_views').insert({
      article_id: articleId,
      user_id: userId,
      ip_address: '', // クライアントサイドでは取得困難
      user_agent: typeof window !== 'undefined' ? navigator.userAgent : '',
    });

    // 記事のビュー数を更新
    await supabase.rpc('increment_view_count', { article_id: articleId });
  }

  /**
   * 記事にいいねを追加/削除
   */
  static async toggleLike(articleId: string, userId: string) {
    const { data: existingLike } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // いいねを削除
      await supabase
        .from('article_likes')
        .delete()
        .eq('id', existingLike.id);
      
      await supabase.rpc('decrement_like_count', { article_id: articleId });
      return false;
    } else {
      // いいねを追加
      await supabase
        .from('article_likes')
        .insert({ article_id: articleId, user_id: userId });
      
      await supabase.rpc('increment_like_count', { article_id: articleId });
      return true;
    }
  }

  /**
   * 関連記事を取得
   */
  static async getRelatedArticles(articleId: string, limit = 4) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*),
        tags:article_tags(tag:tags(*))
      `)
      .neq('id', articleId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Article[];
  }

  /**
   * 人気記事を取得
   */
  static async getPopularArticles(limit = 5) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Article[];
  }

  /**
   * 最新記事を取得
   */
  static async getLatestArticles(limit = 5) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:authors(*),
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Article[];
  }

  // 記事を作成
  async createArticle(articleData: Partial<Article>): Promise<Article> {
    const { data, error } = await this.supabaseClient
      .from('blog_posts')
      .insert([
        {
          title: articleData.title,
          slug: articleData.slug,
          excerpt: articleData.excerpt,
          content: articleData.content,
          status: articleData.status || 'draft',
          featured_image: articleData.featured_image,
          author_id: articleData.author_id,
          category_id: articleData.category_id,
          published_at: articleData.published_at,
        }
      ])
      .select(`
        *,
        author:profiles(*),
        category:blog_categories(*),
        tags:blog_post_tags(tag:blog_tags(*))
      `)
      .single();

    if (error) throw error;
    return this.transformArticle(data);
  }

  // 記事を更新
  async updateArticle(id: string, articleData: Partial<Article>): Promise<Article> {
    const { data, error } = await this.supabaseClient
      .from('blog_posts')
      .update({
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        status: articleData.status,
        featured_image: articleData.featured_image,
        category_id: articleData.category_id,
        published_at: articleData.published_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        author:profiles(*),
        category:blog_categories(*),
        tags:blog_post_tags(tag:blog_tags(*))
      `)
      .single();

    if (error) throw error;
    return this.transformArticle(data);
  }

  // 記事を削除
  async deleteArticle(id: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // データ変換ヘルパー
  private transformArticle(data: any): Article {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || '',
      content: data.content,
      cover_image: data.featured_image,
      featured_image: data.featured_image,
      status: data.status,
      is_premium: data.is_premium || false,
      author_id: data.author_id,
      category_id: data.category_id,
      published_at: data.published_at,
      reading_time: data.reading_time || 0,
      view_count: data.view_count || 0,
      like_count: data.like_count || 0,
      comment_count: data.comment_count || 0,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      seo_keywords: data.seo_keywords,
      created_at: data.created_at,
      updated_at: data.updated_at,
      author: data.author,
      category: data.category,
      tags: data.tags?.map((t: any) => t.tag) || [],
    };
  }
}
