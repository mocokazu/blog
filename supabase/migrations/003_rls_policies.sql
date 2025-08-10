-- Row Level Security (RLS) ポリシーの設定
-- セキュリティとアクセス制御を適切に管理

-- ========================================
-- 1. RLSの有効化
-- ========================================

-- 全テーブルでRLSを有効化
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE live2d_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vrm_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE models_3d ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes_3d ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_access ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. ユーザー設定関連ポリシー
-- ========================================

-- ユーザー設定: 自分の設定のみ閲覧・編集可能
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 3. ブログ関連ポリシー
-- ========================================

-- 記事タグ: 公開記事のタグは誰でも閲覧可能
CREATE POLICY "Published article tags are viewable by everyone" ON article_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE blog_posts.id = article_tags.article_id 
      AND blog_posts.status = 'published'
    )
  );

-- 管理者は全ての記事タグを管理可能
CREATE POLICY "Admins can manage all article tags" ON article_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 記事ビュー: 誰でも記録可能、自分のビューのみ閲覧可能
CREATE POLICY "Anyone can record article views" ON article_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own article views" ON article_views
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- 記事いいね: 認証ユーザーのみ
CREATE POLICY "Authenticated users can like articles" ON article_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view article likes" ON article_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can remove their own likes" ON article_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 4. キャラクター関連ポリシー
-- ========================================

-- Live2Dモデル: アクティブなモデルは誰でも閲覧可能
CREATE POLICY "Active Live2D models are viewable by everyone" ON live2d_models
  FOR SELECT USING (true);

-- 管理者のみ編集可能
CREATE POLICY "Admins can manage Live2D models" ON live2d_models
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- VRMモデル: 同様のポリシー
CREATE POLICY "Active VRM models are viewable by everyone" ON vrm_models
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage VRM models" ON vrm_models
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- キャラクター: アクティブなキャラクターは誰でも閲覧可能
CREATE POLICY "Active characters are viewable by everyone" ON characters
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage characters" ON characters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- キャラクターインタラクション: 誰でも記録可能
CREATE POLICY "Anyone can record character interactions" ON character_interactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view character interactions" ON character_interactions
  FOR SELECT USING (true);

-- ========================================
-- 5. ポートフォリオ関連ポリシー
-- ========================================

-- ポートフォリオカテゴリ: 誰でも閲覧可能
CREATE POLICY "Portfolio categories are viewable by everyone" ON portfolio_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage portfolio categories" ON portfolio_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 技術スタック: 誰でも閲覧可能
CREATE POLICY "Technologies are viewable by everyone" ON technologies
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage technologies" ON technologies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 3Dモデル: 誰でも閲覧可能
CREATE POLICY "3D models are viewable by everyone" ON models_3d
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage 3D models" ON models_3d
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ポートフォリオ: 公開されたもののみ閲覧可能
CREATE POLICY "Published portfolios are viewable by everyone" ON portfolios
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage portfolios" ON portfolios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ポートフォリオ技術関連: 公開ポートフォリオの技術は閲覧可能
CREATE POLICY "Published portfolio technologies are viewable" ON portfolio_technologies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = portfolio_technologies.portfolio_id 
      AND portfolios.status = 'published'
    )
  );

CREATE POLICY "Admins can manage portfolio technologies" ON portfolio_technologies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 3Dシーン: 誰でも閲覧可能
CREATE POLICY "3D scenes are viewable by everyone" ON scenes_3d
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage 3D scenes" ON scenes_3d
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ========================================
-- 6. サブスクリプション関連ポリシー
-- ========================================

-- サブスクリプションプラン: アクティブなプランは誰でも閲覧可能
CREATE POLICY "Active subscription plans are viewable by everyone" ON subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" ON subscription_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- サブスクリプション: 自分のサブスクリプションのみ閲覧可能
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (true);

-- 決済: 自分の決済履歴のみ閲覧可能
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert payments" ON payments
  FOR INSERT WITH CHECK (true);

-- プレミアムコンテンツ: 誰でも閲覧可能（アクセス制御は別途）
CREATE POLICY "Premium content is viewable by everyone" ON premium_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage premium content" ON premium_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ユーザーアクセス: 自分のアクセス権のみ閲覧可能
CREATE POLICY "Users can view their own access rights" ON user_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage user access" ON user_access
  FOR ALL WITH CHECK (true);

-- ========================================
-- 7. 管理者用ポリシー
-- ========================================

-- 管理者は全てのデータを閲覧・編集可能
CREATE POLICY "Admins can view all data" ON user_preferences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- プロフィールテーブルの拡張（roleカラムが必要）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- プロフィールのRLSポリシー更新
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ========================================
-- 8. 関数のセキュリティ設定
-- ========================================

-- 関数の実行権限を適切に設定
REVOKE ALL ON FUNCTION increment_view_count(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;

REVOKE ALL ON FUNCTION increment_like_count(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_like_count(UUID) TO authenticated;

REVOKE ALL ON FUNCTION decrement_like_count(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION decrement_like_count(UUID) TO authenticated;
