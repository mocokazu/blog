import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSのクラス名を結合するユーティリティ関数
 * clsxとtailwind-mergeを組み合わせて、条件付きクラス名と重複クラス名の解決を行う
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
