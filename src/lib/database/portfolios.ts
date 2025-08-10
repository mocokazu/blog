import { supabase } from '@/lib/supabase';
import { Portfolio, PortfolioCategory, Technology, Scene3D } from '@/types/portfolio';

export class PortfolioService {
  /**
   * 公開ポートフォリオ一覧を取得
   */
  static async getPublishedPortfolios(options: {
    page?: number;
    limit?: number;
    category?: string;
    technology?: string;
    featured?: boolean;
  } = {}) {
    const { page = 1, limit = 12, category, technology, featured } = options;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('portfolios')
      .select(`
        *,
        category:portfolio_categories(*),
        technologies:portfolio_technologies(technology:technologies(*))
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category.slug', category);
    }

    if (technology) {
      query = query.contains('technologies.slug', [technology]);
    }

    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .returns<Portfolio[]>();

    if (error) throw error;

    return {
      portfolios: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * スラッグでポートフォリオを取得
   */
  static async getPortfolioBySlug(slug: string) {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        category:portfolio_categories(*),
        technologies:portfolio_technologies(technology:technologies(*))
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return data as Portfolio;
  }

  /**
   * 注目ポートフォリオを取得
   */
  static async getFeaturedPortfolios(limit = 6) {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        category:portfolio_categories(*),
        technologies:portfolio_technologies(technology:technologies(*))
      `)
      .eq('status', 'published')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Portfolio[];
  }

  /**
   * ポートフォリオカテゴリ一覧を取得
   */
  static async getPortfolioCategories() {
    const { data, error } = await supabase
      .from('portfolio_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data as PortfolioCategory[];
  }

  /**
   * 技術スタック一覧を取得
   */
  static async getTechnologies(category?: string) {
    let query = supabase
      .from('technologies')
      .select('*')
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Technology[];
  }

  /**
   * 3Dシーンを取得
   */
  static async get3DScene(id?: string) {
    let query = supabase
      .from('scenes_3d')
      .select(`
        *,
        portfolios:portfolios(
          *,
          category:portfolio_categories(*),
          technologies:portfolio_technologies(technology:technologies(*))
        )
      `);

    if (id) {
      query = query.eq('id', id);
    } else {
      // デフォルトシーンを取得
      query = query.order('created_at', { ascending: true }).limit(1);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data as Scene3D;
  }

  /**
   * 3D空間用のポートフォリオ配置データを取得
   */
  static async getPortfoliosFor3D() {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        category:portfolio_categories(*),
        technologies:portfolio_technologies(technology:technologies(*))
      `)
      .eq('status', 'published')
      .not('position_3d', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Portfolio[];
  }

  /**
   * 関連ポートフォリオを取得
   */
  static async getRelatedPortfolios(portfolioId: string, limit = 4) {
    // 同じカテゴリまたは技術スタックを持つポートフォリオを取得
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        category:portfolio_categories(*),
        technologies:portfolio_technologies(technology:technologies(*))
      `)
      .neq('id', portfolioId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Portfolio[];
  }

  /**
   * 技術スタック別の統計を取得
   */
  static async getTechnologyStats() {
    const { data, error } = await supabase
      .from('portfolio_technologies')
      .select(`
        technology:technologies(name, category),
        portfolio:portfolios!inner(status)
      `)
      .eq('portfolio.status', 'published');

    if (error) throw error;

    // 技術別の使用回数を集計
    const stats = data.reduce((acc: Record<string, { name: string; category: string; count: number }>, item: any) => {
      const tech = item.technology;
      if (!tech) return acc;

      const key = tech.name;
      if (!acc[key]) {
        acc[key] = {
          name: tech.name,
          category: tech.category,
          count: 0,
        };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, { name: string; category: string; count: number }>);

    return Object.values(stats).sort((a, b) => (b as { count: number }).count - (a as { count: number }).count);
  }
}
