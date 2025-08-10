import type { Database } from './database'

// データベーステーブルの型エイリアス
export type Profile = Database['public']['Tables']['profiles']['Row']
export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type BlogCategory = Database['public']['Tables']['blog_categories']['Row']
export type BlogTag = Database['public']['Tables']['blog_tags']['Row']
export type PortfolioProject = Database['public']['Tables']['portfolio_projects']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type CharacterSetting = Database['public']['Tables']['character_settings']['Row']

// Insert用の型
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert']
export type BlogCategoryInsert = Database['public']['Tables']['blog_categories']['Insert']
export type BlogTagInsert = Database['public']['Tables']['blog_tags']['Insert']
export type PortfolioProjectInsert = Database['public']['Tables']['portfolio_projects']['Insert']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
export type CharacterSettingInsert = Database['public']['Tables']['character_settings']['Insert']

// Update用の型
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update']
export type BlogCategoryUpdate = Database['public']['Tables']['blog_categories']['Update']
export type BlogTagUpdate = Database['public']['Tables']['blog_tags']['Update']
export type PortfolioProjectUpdate = Database['public']['Tables']['portfolio_projects']['Update']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']
export type CharacterSettingUpdate = Database['public']['Tables']['character_settings']['Update']

// 拡張された型定義
export interface BlogPostWithDetails extends BlogPost {
  author?: Profile
  category?: BlogCategory
  tags?: BlogTag[]
  comments_count?: number
}

export interface PortfolioProjectWithDetails extends PortfolioProject {
  tech_stack?: string[]
}

export interface CommentWithAuthor extends Comment {
  author?: Profile
  replies?: CommentWithAuthor[]
}

// ページネーション用の型
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// 検索・フィルタリング用の型
export interface BlogPostFilters {
  category?: string
  tags?: string[]
  status?: BlogPost['status']
  is_premium?: boolean
  author_id?: string
  search?: string
}

export interface PortfolioProjectFilters {
  status?: PortfolioProject['status']
  technologies?: string[]
  featured?: boolean
  search?: string
}

// API レスポンス用の型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

// 認証関連の型
export interface AuthUser {
  id: string
  email?: string
  profile?: Profile
}

export interface AuthSession {
  user: AuthUser
  access_token: string
  refresh_token: string
  expires_at: number
}

// フォーム用の型
export interface BlogPostFormData {
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  category_id?: string
  tag_ids?: string[]
  status: BlogPost['status']
  is_premium: boolean
  published_at?: string
}

export interface PortfolioProjectFormData {
  title: string
  slug: string
  description?: string
  content?: string
  featured_image?: string
  gallery_images?: string[]
  technologies?: string[]
  project_url?: string
  github_url?: string
  status: PortfolioProject['status']
  featured: boolean
}

export interface ProfileFormData {
  username?: string
  full_name?: string
  bio?: string
  website?: string
  twitter_handle?: string
  github_handle?: string
  linkedin_handle?: string
  avatar_url?: string
}

// キャラクター関連の型
export interface CharacterVoiceSettings {
  voice_id?: string
  pitch?: number
  speed?: number
  volume?: number
}

export interface CharacterAnimationSettings {
  idle_animations?: string[]
  interaction_animations?: string[]
  transition_duration?: number
}

export interface CharacterPersonality {
  traits: string[]
  greeting_messages: string[]
  response_patterns: Record<string, string[]>
}

// 3Dポートフォリオ関連の型
export interface Portfolio3DItem {
  id: string
  project_id: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  model_url?: string
  thumbnail_url?: string
}

export interface Portfolio3DScene {
  items: Portfolio3DItem[]
  camera_position: [number, number, number]
  lighting_settings: {
    ambient_intensity: number
    directional_intensity: number
    directional_position: [number, number, number]
  }
}

// Stripe関連の型
export interface StripeCustomer {
  id: string
  email: string
  name?: string
}

export interface StripeSubscription {
  id: string
  customer: string
  status: string
  current_period_start: number
  current_period_end: number
  items: {
    data: Array<{
      price: {
        id: string
        unit_amount: number
        currency: string
        recurring: {
          interval: string
        }
      }
    }>
  }
}

// ユーティリティ型
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
