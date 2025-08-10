# Logo ガイド（LogicEdge）

`src/components/common/Logo.tsx` は、以下のパスのロゴを自動表示します（SVG 優先、なければ PNG）。

- ライト用（いずれか）: `public/brand/logo.svg` または `public/brand/logo.png`
- ダーク用（任意・いずれか）: `public/brand/logo-dark.svg` または `public/brand/logo-dark.png`

どちらも存在しない場合はテキスト "LogicEdge" を表示します。

## 置き方
1. `public/brand/` ディレクトリにファイルを配置
2. ファイル名は固定: `logo.svg`/`logo.png` と `logo-dark.svg`/`logo-dark.png`
3. ブラウザ更新で反映（ビルド不要）

## 推奨仕様
- 形式: SVG（推奨、背景透過） or PNG（背景透過推奨）
- 推奨サイズ（見た目）: 高さ 24px（`h-6`）相当、横は自動
- `viewBox` を設定し、レスポンシブで崩れないように
- ダーク用は背景が暗いときに見やすい配色（明色）
  - PNG の場合は高解像度（例: 高さ 48px の素材を配置）だとよりクッキリ表示されます

## 代替:
- ダーク用を用意しない場合: `logo.svg` または `logo.png` のみでOK（ダークテーマでも同じロゴが表示）

## 注意
- 表示の優先順位: SVG が存在すれば SVG、無ければ PNG を表示します。
- WebP を使いたい場合はコンポーネントの対応が必要です（現在は SVG/PNG のみ）。
- ブラウザキャッシュで差し替えが反映されない場合はハードリロードしてください。
- ファビコンは別管理（`/favicon.svg` または `app/icon.tsx`/`metadata.icons` で設定）。
