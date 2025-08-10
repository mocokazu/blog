# AI駆動型ブログ・ポートフォリオ MVP

本リポジトリは Next.js 14 + TypeScript + Tailwind + Firebase を用いたブログ/ポートフォリオ MVP です。MVPではブログ CRUD、認証、公開記事表示、シンプルなAI連携準備を対象とします。

## セットアップ

1. 依存インストール

```bash
npm install
```

2. 環境変数
- `.env.local` を作成し、`.env.example` を参考に Firebase の `NEXT_PUBLIC_FIREBASE_*` を設定

3. 開発サーバ

```bash
npm run dev
```

## スクリプト

- `npm run dev` – 開発サーバ起動
- `npm run build` – 本番ビルド
- `npm start` – 本番起動
- `npm run lint` – ESLint 実行
- `npm run type-check` – TypeScript 型チェック（noEmit）
- `npm run clean` – `.next` を削除（ビルドキャッシュクリーン）
- `npm run format` – Prettier で整形
- `npm run format:check` – 整形チェック
- `npm run ci:check` – Lint -> Type-check -> Build を一括実行

## コーディング規約

- ESLint: `next/core-web-vitals` + `@typescript-eslint` + Prettier
- Prettier: Tailwind プラグインを使用
- エディタ設定は `.editorconfig` に統一

## Firebase 設定

- Firestore ルール: `firestore.rules`
- Firestore インデックス: `firestore.indexes.json`
- ルール/インデックスの参照: `firebase.json`

Firebase CLI を使用してデプロイします（要: ログイン、プロジェクト選択）。

```bash
# 初回のみ
firebase login
firebase use <your-project-id>

# ルール/インデックスのみデプロイ
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# まとめて
firebase deploy --only firestore
```

注意: ルールでは以下を許可しています。
- 公開記事(`published==true`)は誰でも read 可
- 非公開記事は作者のみ read/update/delete 可
- create は `authorId == auth.uid` のみ
- update では `slug` の不変性を担保

## 実装ハイライト

- `src/services/postService.ts`
  - 公開一覧取得は `published==true` を自動付与
  - `getPostBySlug(slug)` も公開記事のみ対象（下書きプレビューは管理画面で ID 取得を使用）
  - `updatePost()` は slug を更新しない（ルール整合）
- `src/app/blog/page.tsx`
  - 公開記事一覧（slugリンク）
- `src/app/blog/[id]/page.tsx`
  - slug を URL パラメータとして使用（将来的に `[slug]` へリネーム予定）
- `src/app/reset-password/page.tsx`
  - パスワードリセット UI
- `src/components/auth/PrivateRoute.tsx`, `AuthGuard`
  - 管理画面の保護

## CI/CD

- GitHub Actions: `.github/workflows/ci.yml`
  - Node 20
  - `npm install` -> `npm run ci:check`

## トラブルシュート

- `tsc` が `.next/types` 由来の古い参照で落ちる場合
  - `npm run clean` で `.next` を削除し、`npm run dev` で再生成→`Ctrl+C`で停止後 `npm run type-check`

## 今後の計画（抜粋）
- Firestore ルールの e2e 検証（テスト追加）
- 管理画面の下書きプレビュー/検索・フィルタ
- `[id]` ディレクトリを `[slug]` へリネーム
- シンプルな AI 記事生成フォームの導入
