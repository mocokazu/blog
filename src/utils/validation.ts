/**
 * メールアドレスの形式をチェックする
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * URLの形式をチェックする
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 文字列が空でないかチェックする
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * 空でない文字列かどうかをチェック
 */
export function isNonEmptyString(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * 空でない文字列かどうかをチェック（nullやundefinedも許可）
 */
export function isNonEmptyStringOrEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || isNonEmptyString(value);
}

/**
 * パスワードの強度をチェックする
 * 最低8文字、大文字・小文字・数字を含む
 */
export function isStrongPassword(password: string): boolean {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
}

/**
 * スラッグの形式をチェックする（URL用）
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * 文字列をスラッグに変換する
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 特殊文字を削除
    .replace(/[\s_-]+/g, '-') // スペースやアンダースコアをハイフンに変換
    .replace(/^-+|-+$/g, ''); // 先頭と末尾のハイフンを削除
}
