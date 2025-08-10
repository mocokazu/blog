export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          twitter_handle: string | null
          github_handle: string | null
          linkedin_handle: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          twitter_handle?: string | null
          github_handle?: string | null
          linkedin_handle?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          twitter_handle?: string | null
          github_handle?: string | null
          linkedin_handle?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string
          language: string
          notifications: any
          character_settings: any
          display_settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          language?: string
          notifications?: any
          character_settings?: any
          display_settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          language?: string
          notifications?: any
          character_settings?: any
          display_settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image: string | null
          author_id: string | null
          category_id: string | null
          status: string
          is_premium: boolean
          view_count: number
          reading_time: number
          like_count: number
          comment_count: number
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image?: string | null
          author_id?: string | null
          category_id?: string | null
          status?: string
          is_premium?: boolean
          view_count?: number
          reading_time?: number
          like_count?: number
          comment_count?: number
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image?: string | null
          author_id?: string | null
          category_id?: string | null
          status?: string
          is_premium?: boolean
          view_count?: number
          reading_time?: number
          like_count?: number
          comment_count?: number
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      article_tags: {
        Row: {
          id: string
          article_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      article_views: {
        Row: {
          id: string
          article_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          article_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
      }
      article_likes: {
        Row: {
          id: string
          article_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          user_id?: string
          created_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          model_id: string | null
          personality: any
          voice_settings: any
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          model_id?: string | null
          personality?: any
          voice_settings?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          model_id?: string | null
          personality?: any
          voice_settings?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      live2d_models: {
        Row: {
          id: string
          name: string
          description: string | null
          model_path: string
          texture_paths: string[] | null
          physics_path: string | null
          pose_path: string | null
          expressions: any
          motions: any
          hit_areas: any
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          model_path: string
          texture_paths?: string[] | null
          physics_path?: string | null
          pose_path?: string | null
          expressions?: any
          motions?: any
          hit_areas?: any
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          model_path?: string
          texture_paths?: string[] | null
          physics_path?: string | null
          pose_path?: string | null
          expressions?: any
          motions?: any
          hit_areas?: any
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      vrm_models: {
        Row: {
          id: string
          name: string
          description: string | null
          model_path: string
          thumbnail: string | null
          animations: any
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          model_path: string
          thumbnail?: string | null
          animations?: any
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          model_path?: string
          thumbnail?: string | null
          animations?: any
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      portfolios: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          content: string | null
          cover_image: string | null
          images: string[] | null
          project_url: string | null
          github_url: string | null
          demo_url: string | null
          status: string
          featured: boolean
          category_id: string | null
          position_3d: any | null
          model_3d_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          content?: string | null
          cover_image?: string | null
          images?: string[] | null
          project_url?: string | null
          github_url?: string | null
          demo_url?: string | null
          status?: string
          featured?: boolean
          category_id?: string | null
          position_3d?: any | null
          model_3d_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          content?: string | null
          cover_image?: string | null
          images?: string[] | null
          project_url?: string | null
          github_url?: string | null
          demo_url?: string | null
          status?: string
          featured?: boolean
          category_id?: string | null
          position_3d?: any | null
          model_3d_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          currency: string
          interval_type: string
          stripe_price_id: string | null
          features: any
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          currency?: string
          interval_type: string
          stripe_price_id?: string | null
          features?: any
          is_active?: boolean
          status?: 'active' | 'archived' | 'in_progress'
          featured?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          content?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          technologies?: string[] | null
          project_url?: string | null
          github_url?: string | null
          status?: 'active' | 'archived' | 'in_progress'
          featured?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          author_id: string | null
          post_id: string | null
          parent_id: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          author_id?: string | null
          post_id?: string | null
          parent_id?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          author_id?: string | null
          post_id?: string | null
          parent_id?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: 'active' | 'canceled' | 'past_due' | 'unpaid'
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status: 'active' | 'canceled' | 'past_due' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      character_settings: {
        Row: {
          id: string
          name: string
          model_type: 'live2d' | 'vrm'
          model_url: string
          thumbnail_url: string | null
          description: string | null
          personality_traits: string[] | null
          voice_settings: Json | null
          animation_settings: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          model_type: 'live2d' | 'vrm'
          model_url: string
          thumbnail_url?: string | null
          description?: string | null
          personality_traits?: string[] | null
          voice_settings?: Json | null
          animation_settings?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          model_type?: 'live2d' | 'vrm'
          model_url?: string
          thumbnail_url?: string | null
          description?: string | null
          personality_traits?: string[] | null
          voice_settings?: Json | null
          animation_settings?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
