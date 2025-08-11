export interface Tag {
  id?: string;  // Firestoreドキュメントid
  name: string; // タグ名（表示用）
  slug: string; // URLスラッグ
  description?: string; // タグの説明
  count?: number; // このタグが付けられた記事数
}

// タグ選択用のシンプルな型
export interface TagOption {
  id: string;
  name: string;
  slug: string;
}

// スラッグ生成用のユーティリティ関数
export const generateTagSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\sぁ-んァ-ン一-龥-]/g, '') // 日本語・英数字・スペース・ハイフン以外を削除
    .trim()
    .replace(/\s+/g, '-') // スペースをハイフンに置換
    .replace(/-+/g, '-'); // 連続するハイフンを1つに
};
