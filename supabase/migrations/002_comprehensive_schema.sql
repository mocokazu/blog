-- 包括的なデータベーススキーマ
-- 既存のテーブルを拡張し、新しい機能に対応

-- ========================================
-- 1. ユーザー関連テーブルの拡張
-- ========================================

-- ユーザー設定テーブル
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  language TEXT DEFAULT 'ja' CHECK (language IN ('ja', 'en')),
  notifications JSONB DEFAULT '{
    "email": true,
    "push": true,
    "new_articles": true,
    "comments": true,
    "marketing": false
  }'::jsonb,
  character_settings JSONB DEFAULT '{
    "preferred_character_id": null,
    "interaction_level": "normal",
    "voice_enabled": false
  }'::jsonb,
  display_settings JSONB DEFAULT '{
    "articles_per_page": 10,
    "show_reading_time": true,
    "show_view_count": true,
    "auto_play_videos": false
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ========================================
-- 2. ブログ関連テーブルの拡張
-- ========================================

-- 記事テーブルの拡張（既存のblog_postsを更新）
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];

-- 記事タグ関連テーブル
CREATE TABLE article_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, tag_id)
);

-- 記事ビューログテーブル
CREATE TABLE article_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 記事いいねテーブル
CREATE TABLE article_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

-- ========================================
-- 3. キャラクター関連テーブル
-- ========================================

-- Live2Dモデルテーブル
CREATE TABLE live2d_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  model_path TEXT NOT NULL,
  texture_paths TEXT[],
  physics_path TEXT,
  pose_path TEXT,
  expressions JSONB DEFAULT '[]'::jsonb,
  motions JSONB DEFAULT '[]'::jsonb,
  hit_areas JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VRMモデルテーブル
CREATE TABLE vrm_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  model_path TEXT NOT NULL,
  thumbnail TEXT,
  animations JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{
    "scale": 1,
    "position": {"x": 0, "y": 0, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0},
    "lighting": {"intensity": 1, "color": "#ffffff"}
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- キャラクターテーブル
CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('live2d', 'vrm')),
  model_id UUID,
  personality JSONB DEFAULT '{
    "traits": [],
    "speaking_style": "",
    "favorite_topics": [],
    "responses": []
  }'::jsonb,
  voice_settings JSONB DEFAULT '{
    "voice_id": null,
    "speed": 1.0,
    "pitch": 1.0,
    "volume": 1.0,
    "language": "ja"
  }'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- キャラクターインタラクションログテーブル
CREATE TABLE character_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('click', 'hover', 'message', 'gesture')),
  trigger_area TEXT,
  message TEXT,
  response TEXT,
  emotion TEXT,
  motion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. ポートフォリオ関連テーブル
-- ========================================

-- ポートフォリオカテゴリテーブル
CREATE TABLE portfolio_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 技術スタックテーブル
CREATE TABLE technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'devops', 'design', 'other')),
  proficiency INTEGER DEFAULT 1 CHECK (proficiency >= 1 AND proficiency <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3Dモデルテーブル
CREATE TABLE models_3d (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  thumbnail TEXT,
  type TEXT NOT NULL CHECK (type IN ('gltf', 'glb', 'obj', 'fbx')),
  animations JSONB DEFAULT '[]'::jsonb,
  materials JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{
    "scale": 1,
    "position": {"x": 0, "y": 0, "z": 0},
    "lighting": {
      "ambient_intensity": 0.6,
      "directional_intensity": 0.8,
      "directional_position": {"x": 1, "y": 1, "z": 1}
    },
    "shadows": true,
    "wireframe": false
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ポートフォリオテーブル
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  cover_image TEXT,
  images TEXT[],
  project_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  category_id UUID REFERENCES portfolio_categories(id),
  position_3d JSONB,
  model_3d_id UUID REFERENCES models_3d(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ポートフォリオ技術関連テーブル
CREATE TABLE portfolio_technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(portfolio_id, technology_id)
);

-- 3Dシーンテーブル
CREATE TABLE scenes_3d (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  environment JSONB DEFAULT '{
    "skybox": null,
    "ground_texture": null,
    "fog": {"enabled": false, "color": "#ffffff", "near": 1, "far": 100},
    "background_color": "#f0f0f0"
  }'::jsonb,
  lighting JSONB DEFAULT '{
    "ambient": {"color": "#ffffff", "intensity": 0.6},
    "directional": {
      "color": "#ffffff",
      "intensity": 0.8,
      "position": {"x": 1, "y": 1, "z": 1},
      "cast_shadow": true
    },
    "point_lights": []
  }'::jsonb,
  camera JSONB DEFAULT '{
    "position": {"x": 0, "y": 1.5, "z": 3},
    "target": {"x": 0, "y": 0, "z": 0},
    "fov": 45,
    "near": 0.1,
    "far": 1000,
    "controls": {
      "enabled": true,
      "auto_rotate": false,
      "auto_rotate_speed": 2,
      "enable_zoom": true,
      "enable_pan": true,
      "min_distance": 1,
      "max_distance": 20
    }
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. サブスクリプション関連テーブル
-- ========================================

-- サブスクリプションプランテーブル
CREATE TABLE subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JPY' CHECK (currency IN ('JPY', 'USD')),
  interval_type TEXT NOT NULL CHECK (interval_type IN ('month', 'year')),
  stripe_price_id TEXT UNIQUE,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- サブスクリプションテーブル
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 決済テーブル
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- プレミアムコンテンツテーブル
CREATE TABLE premium_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'video', 'download', 'live_stream')),
  content_id UUID,
  required_plan_id UUID REFERENCES subscription_plans(id),
  is_free_trial BOOLEAN DEFAULT false,
  trial_duration_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザーアクセステーブル
CREATE TABLE user_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES premium_content(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL CHECK (access_type IN ('subscription', 'purchase', 'trial', 'gift')),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- ========================================
-- 6. インデックスの作成
-- ========================================

-- パフォーマンス向上のためのインデックス
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON article_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_character_interactions_character_id ON character_interactions(character_id);
CREATE INDEX IF NOT EXISTS idx_character_interactions_created_at ON character_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON portfolios(featured);
CREATE INDEX IF NOT EXISTS idx_portfolios_category_id ON portfolios(category_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ========================================
-- 7. データベース関数の作成
-- ========================================

-- ビュー数増加関数
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET view_count = view_count + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- いいね数増加関数
CREATE OR REPLACE FUNCTION increment_like_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET like_count = like_count + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- いいね数減少関数
CREATE OR REPLACE FUNCTION decrement_like_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET like_count = GREATEST(like_count - 1, 0) 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- updated_at自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 8. トリガーの作成
-- ========================================

-- updated_at自動更新トリガー
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live2d_models_updated_at
  BEFORE UPDATE ON live2d_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vrm_models_updated_at
  BEFORE UPDATE ON vrm_models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_categories_updated_at
  BEFORE UPDATE ON portfolio_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technologies_updated_at
  BEFORE UPDATE ON technologies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_3d_updated_at
  BEFORE UPDATE ON models_3d
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenes_3d_updated_at
  BEFORE UPDATE ON scenes_3d
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_premium_content_updated_at
  BEFORE UPDATE ON premium_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
