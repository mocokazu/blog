export interface Category {
  id?: string;  // Firestoreドキュメントid
  name: string; // カテゴリ名（表示用）
  slug: string; // URLスラッグ
  description?: string; // カテゴリの説明
  parentId?: string; // 親カテゴリのID（サブカテゴリの場合）
  count?: number; // このカテゴリに属する記事数
  sortOrder?: number; // 表示順
}

// カテゴリ選択用のシンプルな型
export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

// カテゴリツリー用の型（階層構造表示用）
export interface CategoryTreeItem extends Category {
  children?: CategoryTreeItem[];
}

// スラッグ生成用のユーティリティ関数（post.tsと同じロジック）
export const generateCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\sぁ-んァ-ン一-龥-]/g, '') // 日本語・英数字・スペース・ハイフン以外を削除
    .trim()
    .replace(/\s+/g, '-') // スペースをハイフンに置換
    .replace(/-+/g, '-'); // 連続するハイフンを1つに
};
