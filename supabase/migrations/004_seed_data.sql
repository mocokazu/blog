-- 初期データの投入
-- 開発・テスト用のサンプルデータを作成

-- ========================================
-- 1. ブログカテゴリの初期データ
-- ========================================

INSERT INTO blog_categories (name, slug, description, color) VALUES
('技術記事', 'tech', 'プログラミングや開発に関する技術的な記事', '#3B82F6'),
('チュートリアル', 'tutorial', 'ステップバイステップの学習コンテンツ', '#10B981'),
('ライフハック', 'lifehack', '日常生活や仕事効率化のヒント', '#F59E0B'),
('デザイン', 'design', 'UI/UXデザインやクリエイティブな話題', '#EF4444'),
('雑記', 'misc', 'その他の雑多な話題', '#8B5CF6')
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- 2. ブログタグの初期データ
-- ========================================

INSERT INTO blog_tags (name, slug) VALUES
('React', 'react'),
('Next.js', 'nextjs'),
('TypeScript', 'typescript'),
('JavaScript', 'javascript'),
('CSS', 'css'),
('Tailwind CSS', 'tailwindcss'),
('Node.js', 'nodejs'),
('Python', 'python'),
('AI', 'ai'),
('機械学習', 'machine-learning'),
('Web開発', 'web-development'),
('フロントエンド', 'frontend'),
('バックエンド', 'backend'),
('データベース', 'database'),
('API', 'api'),
('パフォーマンス', 'performance'),
('セキュリティ', 'security'),
('テスト', 'testing'),
('DevOps', 'devops'),
('Git', 'git')
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- 3. ポートフォリオカテゴリの初期データ
-- ========================================

INSERT INTO portfolio_categories (name, slug, description, color, icon) VALUES
('Webアプリケーション', 'web-app', 'フルスタックWebアプリケーション', '#3B82F6', '🌐'),
('モバイルアプリ', 'mobile-app', 'iOS/Androidアプリケーション', '#10B981', '📱'),
('デスクトップアプリ', 'desktop-app', 'デスクトップアプリケーション', '#F59E0B', '💻'),
('ライブラリ・ツール', 'library-tool', 'オープンソースライブラリやツール', '#EF4444', '🔧'),
('ゲーム', 'game', 'ゲーム開発プロジェクト', '#8B5CF6', '🎮'),
('AI・機械学習', 'ai-ml', 'AI・機械学習プロジェクト', '#06B6D4', '🤖'),
('IoT', 'iot', 'IoTデバイス・システム', '#84CC16', '📡'),
('その他', 'other', 'その他のプロジェクト', '#6B7280', '📦')
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- 4. 技術スタックの初期データ
-- ========================================

INSERT INTO technologies (name, slug, description, category, proficiency, color, icon) VALUES
-- フロントエンド
('React', 'react', 'ユーザーインターフェース構築のためのJavaScriptライブラリ', 'frontend', 5, '#61DAFB', '⚛️'),
('Next.js', 'nextjs', 'React用のフルスタックフレームワーク', 'frontend', 5, '#000000', '▲'),
('TypeScript', 'typescript', 'JavaScriptに静的型付けを追加', 'frontend', 5, '#3178C6', '🔷'),
('Tailwind CSS', 'tailwindcss', 'ユーティリティファーストのCSSフレームワーク', 'frontend', 5, '#06B6D4', '💨'),
('Vue.js', 'vuejs', 'プログレッシブJavaScriptフレームワーク', 'frontend', 4, '#4FC08D', '💚'),
('Angular', 'angular', 'TypeScriptベースのWebアプリケーションフレームワーク', 'frontend', 3, '#DD0031', '🅰️'),

-- バックエンド
('Node.js', 'nodejs', 'サーバーサイドJavaScriptランタイム', 'backend', 5, '#339933', '🟢'),
('Python', 'python', '汎用プログラミング言語', 'backend', 4, '#3776AB', '🐍'),
('Go', 'go', 'Googleが開発したプログラミング言語', 'backend', 3, '#00ADD8', '🐹'),
('Rust', 'rust', 'システムプログラミング言語', 'backend', 2, '#000000', '🦀'),
('Java', 'java', 'オブジェクト指向プログラミング言語', 'backend', 3, '#ED8B00', '☕'),

-- データベース
('PostgreSQL', 'postgresql', 'オープンソースリレーショナルデータベース', 'database', 4, '#336791', '🐘'),
('MySQL', 'mysql', 'オープンソースリレーショナルデータベース', 'database', 4, '#4479A1', '🐬'),
('MongoDB', 'mongodb', 'NoSQLドキュメントデータベース', 'database', 3, '#47A248', '🍃'),
('Redis', 'redis', 'インメモリデータ構造ストア', 'database', 3, '#DC382D', '🔴'),
('Supabase', 'supabase', 'オープンソースFirebase代替', 'database', 5, '#3ECF8E', '⚡'),

-- DevOps
('Docker', 'docker', 'コンテナ化プラットフォーム', 'devops', 4, '#2496ED', '🐳'),
('AWS', 'aws', 'Amazon Web Services', 'devops', 3, '#FF9900', '☁️'),
('Vercel', 'vercel', 'フロントエンドデプロイメントプラットフォーム', 'devops', 5, '#000000', '▲'),
('GitHub Actions', 'github-actions', 'CI/CDプラットフォーム', 'devops', 4, '#2088FF', '🔄'),

-- デザイン
('Figma', 'figma', 'コラボレーティブデザインツール', 'design', 4, '#F24E1E', '🎨'),
('Adobe XD', 'adobe-xd', 'UI/UXデザインツール', 'design', 3, '#FF61F6', '🎭'),
('Sketch', 'sketch', 'デジタルデザインツール', 'design', 2, '#F7B500', '✏️'),

-- その他
('Three.js', 'threejs', '3D JavaScriptライブラリ', 'other', 4, '#000000', '🎲'),
('WebGL', 'webgl', 'Web Graphics Library', 'other', 3, '#990000', '🎮'),
('Live2D', 'live2d', '2Dアニメーションシステム', 'other', 3, '#FF6B9D', '🎭'),
('Unity', 'unity', 'ゲーム開発エンジン', 'other', 2, '#000000', '🎯')
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- 5. サブスクリプションプランの初期データ
-- ========================================

INSERT INTO subscription_plans (name, description, price, currency, interval_type, features, sort_order) VALUES
('無料プラン', '基本的な記事の閲覧が可能です', 0, 'JPY', 'month', 
 '[
   {"name": "記事閲覧", "description": "公開記事の閲覧", "included": true},
   {"name": "コメント投稿", "description": "記事へのコメント", "included": true},
   {"name": "プレミアム記事", "description": "有料記事の閲覧", "included": false},
   {"name": "動画コンテンツ", "description": "限定動画の視聴", "included": false},
   {"name": "ダウンロード", "description": "ソースコードのダウンロード", "included": false}
 ]'::jsonb, 1),

('ベーシックプラン', 'プレミアム記事と基本的な限定コンテンツにアクセス', 500, 'JPY', 'month',
 '[
   {"name": "記事閲覧", "description": "公開記事の閲覧", "included": true},
   {"name": "コメント投稿", "description": "記事へのコメント", "included": true},
   {"name": "プレミアム記事", "description": "有料記事の閲覧", "included": true},
   {"name": "動画コンテンツ", "description": "限定動画の視聴", "included": false},
   {"name": "ダウンロード", "description": "ソースコードのダウンロード", "included": true, "limit": 5}
 ]'::jsonb, 2),

('プレミアムプラン', '全ての限定コンテンツと特典にアクセス', 1000, 'JPY', 'month',
 '[
   {"name": "記事閲覧", "description": "公開記事の閲覧", "included": true},
   {"name": "コメント投稿", "description": "記事へのコメント", "included": true},
   {"name": "プレミアム記事", "description": "有料記事の閲覧", "included": true},
   {"name": "動画コンテンツ", "description": "限定動画の視聴", "included": true},
   {"name": "ダウンロード", "description": "ソースコードのダウンロード", "included": true},
   {"name": "個別相談", "description": "月1回の個別相談", "included": true, "limit": 1}
 ]'::jsonb, 3)
ON CONFLICT (stripe_price_id) DO NOTHING;

-- ========================================
-- 6. キャラクター関連の初期データ
-- ========================================

-- Live2Dモデルのサンプル
INSERT INTO live2d_models (name, description, model_path, settings) VALUES
('アシスタント・ミア', 'メインアシスタントキャラクター', '/live2d/mia/mia.model3.json',
 '{
   "layout": {
     "center_x": 0,
     "center_y": 0,
     "width": 2,
     "height": 2
   },
   "hit_areas_custom": {
     "head_x": 0,
     "head_y": 0.2,
     "body_x": 0,
     "body_y": -0.3
   }
 }'::jsonb)
ON CONFLICT DO NOTHING;

-- VRMモデルのサンプル
INSERT INTO vrm_models (name, description, model_path, settings) VALUES
('3Dアシスタント・レイ', '3D空間用のアシスタントキャラクター', '/models/ray/ray.vrm',
 '{
   "scale": 1,
   "position": {"x": 0, "y": 0, "z": 0},
   "rotation": {"x": 0, "y": 0, "z": 0},
   "lighting": {"intensity": 1, "color": "#ffffff"}
 }'::jsonb)
ON CONFLICT DO NOTHING;

-- キャラクターの作成
INSERT INTO characters (name, description, type, personality, is_active) VALUES
('ミア', 'フレンドリーで知識豊富なアシスタント。技術的な質問から日常的な会話まで幅広く対応します。', 'live2d',
 '{
   "traits": ["親しみやすい", "知識豊富", "サポート好き", "好奇心旺盛"],
   "speaking_style": "丁寧で親しみやすい口調",
   "favorite_topics": ["プログラミング", "技術トレンド", "学習方法", "創作活動"],
   "responses": [
     {
       "trigger": "こんにちは",
       "responses": ["こんにちは！今日も一緒に学習しましょう！", "こんにちは！何かお手伝いできることはありますか？"],
       "emotion": "happy",
       "motion": "wave"
     },
     {
       "trigger": "ありがとう",
       "responses": ["どういたしまして！いつでもお声かけくださいね。", "お役に立てて嬉しいです！"],
       "emotion": "happy",
       "motion": "bow"
     },
     {
       "trigger": "プログラミング",
       "responses": ["プログラミングは楽しいですよね！どの言語に興味がありますか？", "一緒にコードを書いてみましょう！"],
       "emotion": "excited",
       "motion": "thinking"
     }
   ]
 }'::jsonb, true),

('レイ', '3D空間のガイド役。ポートフォリオの案内や技術的な説明を得意とします。', 'vrm',
 '{
   "traits": ["プロフェッショナル", "説明上手", "技術志向", "冷静"],
   "speaking_style": "専門的だが分かりやすい説明",
   "favorite_topics": ["3D技術", "ポートフォリオ", "プロジェクト管理", "技術解説"],
   "responses": [
     {
       "trigger": "案内",
       "responses": ["3D空間へようこそ！ポートフォリオをご案内いたします。", "こちらの作品について詳しく説明いたしましょう。"],
       "emotion": "neutral",
       "motion": "point"
     },
     {
       "trigger": "技術",
       "responses": ["この技術について詳しく解説いたします。", "技術的な質問でしたら、お任せください。"],
       "emotion": "confident",
       "motion": "explain"
     }
   ]
 }'::jsonb, true)
ON CONFLICT DO NOTHING;

-- ========================================
-- 7. 3Dシーンの初期データ
-- ========================================

INSERT INTO scenes_3d (name, description, environment, lighting, camera) VALUES
('メインギャラリー', 'ポートフォリオ作品を展示するメインの3D空間',
 '{
   "skybox": null,
   "ground_texture": "/textures/marble_floor.jpg",
   "fog": {"enabled": true, "color": "#f0f8ff", "near": 10, "far": 50},
   "background_color": "#f0f8ff"
 }'::jsonb,
 '{
   "ambient": {"color": "#ffffff", "intensity": 0.4},
   "directional": {
     "color": "#ffffff",
     "intensity": 1.0,
     "position": {"x": 5, "y": 10, "z": 5},
     "cast_shadow": true
   },
   "point_lights": [
     {
       "color": "#ffddaa",
       "intensity": 0.5,
       "position": {"x": -5, "y": 3, "z": 0},
       "distance": 10,
       "decay": 2
     },
     {
       "color": "#aaddff",
       "intensity": 0.5,
       "position": {"x": 5, "y": 3, "z": 0},
       "distance": 10,
       "decay": 2
     }
   ]
 }'::jsonb,
 '{
   "position": {"x": 0, "y": 2, "z": 8},
   "target": {"x": 0, "y": 1, "z": 0},
   "fov": 50,
   "near": 0.1,
   "far": 100,
   "controls": {
     "enabled": true,
     "auto_rotate": true,
     "auto_rotate_speed": 1,
     "enable_zoom": true,
     "enable_pan": false,
     "min_distance": 3,
     "max_distance": 15
   }
 }'::jsonb)
ON CONFLICT DO NOTHING;

-- ========================================
-- 8. サンプル記事の作成（管理者アカウント作成後に実行）
-- ========================================

-- 注意: この部分は実際の管理者アカウントが作成された後に実行する必要があります
-- 現在はコメントアウトしています

/*
-- サンプル記事の投入（管理者IDを適切に設定してください）
INSERT INTO blog_posts (title, slug, excerpt, content, status, author_id, category_id, published_at, reading_time) 
SELECT 
  'Next.js 14で始めるモダンなブログ構築',
  'nextjs-14-modern-blog',
  'Next.js 14の新機能を活用して、パフォーマンスの高いブログを構築する方法を紹介します。',
  '# Next.js 14で始めるモダンなブログ構築\n\nNext.js 14では、App RouterやServer Componentsなどの新機能が追加され...',
  'published',
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  (SELECT id FROM blog_categories WHERE slug = 'tech' LIMIT 1),
  NOW(),
  5
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'admin');
*/
