# OGデフォ画像 生成プロンプト（ブランド適用済み）

本ドキュメントは、SNS用OGデフォルト画像（1200×630px）をAI画像生成で作るための確定プロンプト集です。外周60pxのセーフマージンを厳守してください。

## ブランド値（確定）
- PRIMARY_COLOR: #0EA5E9
- SECONDARY_COLOR: #6366F1
- LOGO_TEXT: AI
- SITE_NAME: AI Tech Blog
- TAGLINE: AI × Blog × Engineering

---

## 汎用（ツール非依存）
```
目的: 本ブログ全体で使うデフォルトOG画像を生成する。SNSで視認性が高く、AI/エンジニアリングを想起させるミニマルで現代的なデザイン。

要件:
- キャンバス: 1200x630px (1.91:1)
- セーフマージン: 外周60pxには文字/図形を置かない
- 配色: #0EA5E9 → #6366F1 の上品なグラデーション、差し色は必要に応じて微弱に
- 構図: 左にシンプルなモノグラム「AI」または抽象ロゴ、右に抽象的なAIの波形/ノード/回路パターン
- 背景: ソフトノイズ + スムーズグラデーション、うるさくならない
- テキスト: 中央セーフゾーン(幅1020×高さ510以内)に「AI Tech Blog」、小さく「AI × Blog × Engineering」(全体面積の20%以下)。崩れる場合はロゴのみでOK
- 画風: ミニマル、クリーン、シャープ、コントラスト高め、わずかなシネマティック照明、余白重視
- アクセシビリティ: ダーク/ライト双方で読めるよう、文字やロゴに微弱な1pxアウトライン
- 出力: PNG, sRGB, 高解像度, 圧縮アーティファクト禁止

禁止:
- 写実的な人物/著作権素材/既製ロゴ/過度なテクスチャ/ごちゃついたアイコン/ウォーターマーク

バリエーション:
- ライト/ダーク/モノトーンの3案を提示
```

---

## Midjourney（V6想定）
```
Minimal tech blog OG image, clean gradient background #0EA5E9 to #6366F1, subtle noise,
left simple monogram "AI", right abstract neural waves and node network, sharp lines, high contrast,
generous whitespace, optional Japanese typography: "AI Tech Blog" and small "AI × Blog × Engineering" within center safe area,
text <20% area, cinematic lighting, no clutter, no watermark, no people, no stock logos --ar 1.91:1 --v 6 --style raw --s 250 --q 2
```

---

## Stable Diffusion (SDXL)
- Prompt
```
Minimal modern OG image for an AI engineering blog, gradient #0EA5E9 to #6366F1, subtle film grain,
left simple monogram "AI", right abstract AI waveforms and node graph, sharp clean lines, high contrast,
center safe zone for "AI Tech Blog" and small "AI × Blog × Engineering" (optional), text under 20% area, lots of whitespace
```
- Negative Prompt
```
people, faces, watermark, logo of brands, busy patterns, heavy textures, jpeg artifacts, clutter, low contrast
```
- 推奨パラメータ例
```
SDXL, 1200x630, Steps 30-40, CFG 5-7, Denoise 0.5-0.7, Sampler DPM++ 2M Karras, Hires.fix 1.2x (必要なら)
```

---

## DALL·E 3
```
Create a minimal, modern Open Graph image (1200x630) for a Japanese AI engineering blog.
Use a smooth gradient from #0EA5E9 to #6366F1 with subtle noise.
Place a simple monogram "AI" on the left and abstract AI waveforms and node graphs on the right.
Keep strong contrast and generous whitespace. Put "AI Tech Blog" and a small "AI × Blog × Engineering" inside the central safe area
(keep all elements at least 60px away from edges; text under 20% of the canvas). No people, no stock logos, no watermarks.
Export as clean PNG, sRGB.
```

---

## 運用手順
1. それぞれのツールで3案（ライト/ダーク/モノトーン）を生成。
2. ベスト1案を1200×630 PNG(sRGB)で書き出し。
3. 画像をリポジトリの `public/og/og-default.png` に保存。
4. `.env.local` の `NEXT_PUBLIC_OG_DEFAULT=/og/og-default.png` を設定。
5. `npm run build` でプレビューし、SNSカード(Discord/Twitter/X等)で確認。
