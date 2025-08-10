import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 日付を日本語形式でフォーマットする
 */
export function formatDate(date: string | Date, formatStr: string = 'yyyy年M月d日'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: ja });
}

/**
 * 相対的な時間を日本語で表示する（例：「3日前」）
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: ja 
  });
}

/**
 * 記事の読了時間を計算する（日本語の文字数ベース）
 */
export function calculateReadingTime(content: string): number {
  // 日本語の場合、1分間に約400-600文字読めるとされる
  const charactersPerMinute = 500;
  const characterCount = content.length;
  const readingTime = Math.ceil(characterCount / charactersPerMinute);
  
  return Math.max(1, readingTime); // 最低1分
}

/**
 * ISO文字列をDateオブジェクトに変換する
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}
