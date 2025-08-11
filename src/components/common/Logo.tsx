"use client";

import React, { useMemo, useState } from "react";

type Props = {
  className?: string;
  height?: number;
  width?: number;
  alt?: string;
  // テキストフォールバック
  fallbackText?: string;
};

/**
 * ロゴ表示コンポーネント。
 * - public/brand/logo.svg または logo.png を基本ロゴとして表示。
 * - public/brand/logo-dark.svg または logo-dark.png が存在する場合、ダークテーマ時に自動で差し替え。
 * - 画像が存在しない/読み込み失敗時はテキストにフォールバック（SVG→PNGの順で試行）。
 */
export default function Logo({ className = "h-6 w-auto", height, width, alt = "LogicEdge", fallbackText = "LogicEdge" }: Props) {
  const [defaultFailed, setDefaultFailed] = useState(false);
  const [darkFailed, setDarkFailed] = useState(false);
  const [defaultUsePng, setDefaultUsePng] = useState(false);
  const [darkUsePng, setDarkUsePng] = useState(false);
  const [hasDarkLoaded, setHasDarkLoaded] = useState(false);

  // defaultロゴのクラス: ダーク版が読み込めた場合のみ dark:hidden を付与して切替
  const defaultImgClass = useMemo(() => {
    const base = `inline-block ${className}`.trim();
    return hasDarkLoaded ? `${base} dark:hidden` : base;
  }, [className, hasDarkLoaded]);

  const style = useMemo(() => ({ height, width }), [height, width]);
  const defaultSrc = defaultUsePng ? "/brand/logo.png" : "/brand/logo.svg";
  const darkSrc = darkUsePng ? "/brand/logo-dark.png" : "/brand/logo-dark.svg";

  const showTextFallback = defaultFailed && darkFailed;

  return (
    <span className="inline-flex items-center select-none">
      {!showTextFallback && (
        <>
          {/* デフォルトロゴ（常に表示、ダーク版が読み込めたらダークでは非表示） */}
          <img
            src={defaultSrc}
            alt={alt}
            className={defaultImgClass}
            style={style}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => {
              if (!defaultUsePng) setDefaultUsePng(true);
              else setDefaultFailed(true);
            }}
          />

          {/* ダーク版ロゴ（ダークテーマ時のみ表示、成功時にデフォルトをダークで隠す） */}
          <img
            src={darkSrc}
            alt={alt}
            className={`hidden dark:inline-block ${className}`}
            style={style}
            onContextMenu={(e) => e.preventDefault()}
            onLoad={() => setHasDarkLoaded(true)}
            onError={() => {
              if (!darkUsePng) setDarkUsePng(true);
              else setDarkFailed(true);
            }}
          />
        </>
      )}

      {showTextFallback && (
        <span className={`font-semibold ${className}`} style={style}>
          {fallbackText}
        </span>
      )}
    </span>
  );
}
