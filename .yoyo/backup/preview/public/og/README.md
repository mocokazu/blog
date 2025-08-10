# OG 画像配置フォルダ

このディレクトリは、OGデフォルト画像などSNSカード用のアセットを配置するための場所です。

- 推奨ファイル名: `og-default.png`
- 推奨サイズ: 1200×630 (1.91:1)
- セーフマージン: 外周60pxに文字や主要要素を置かない
- 配置パス: `public/` 配下はサイトルートとして配信されるため、このファイルは `/og/og-default.png` で参照されます。
- 環境変数例: `.env.local`
  ```env
  NEXT_PUBLIC_OG_DEFAULT=/og/og-default.png
  ```

配置後の確認:
1) `npm run build` でビルド。
2) 記事ページを開き、OG/Twitter画像が反映されているかをSNSプレビューで確認（X/Discord等）。

注意:
- 実運用のAPIキーは `.env.local` に保存し、`.env.local.example` には空欄のままにしてください。
