'use client';

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from '@/types/character';

interface Live2DViewerProps {
  model: Live2DModel;
  width?: number;
  height?: number;
  onInteraction?: (type: string, area?: string) => void;
  className?: string;
}

export default function Live2DViewer({
  model,
  width = 300,
  height = 400,
  onInteraction,
  className = '',
}: Live2DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initLive2D = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // PIXI.jsアプリケーションを初期化
        const app = new PIXI.Application({
          view: canvasRef.current!,
          width,
          height,
          backgroundColor: 0x000000,
          backgroundAlpha: 0,
          antialias: true,
        });

        appRef.current = app;

        // Live2Dモデルの読み込みをシミュレート
        // 実際の実装では、Live2D Cubism SDK for Webを使用
        await new Promise(resolve => setTimeout(resolve, 1000));

        // モデルが正常に読み込まれた場合の処理
        console.log('Live2D model loaded:', model.name);

        // インタラクション領域の設定
        setupInteractionAreas(app);

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load Live2D model:', err);
        setError('モデルの読み込みに失敗しました');
        setIsLoading(false);
      }
    };

    initLive2D();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [model, width, height]);

  const setupInteractionAreas = (app: PIXI.Application) => {
    // ヒット領域の設定
    model.hit_areas?.forEach(hitArea => {
      const area = new PIXI.Graphics();
      area.beginFill(0x000000, 0); // 透明
      area.drawRect(0, 0, 100, 100); // 仮のサイズ
      area.endFill();
      area.interactive = true;
      // area.buttonMode = true; // PIXI.js v7では削除されたプロパティ

      area.on('pointerdown', () => {
        onInteraction?.('click', hitArea.name);
        playMotion('tap');
      });

      area.on('pointerover', () => {
        onInteraction?.('hover', hitArea.name);
        playExpression('happy');
      });

      app.stage.addChild(area);
    });
  };

  const playMotion = (motionName: string) => {
    // Live2Dモーションの再生
    console.log('Playing motion:', motionName);
  };

  const playExpression = (expressionName: string) => {
    // Live2D表情の変更
    console.log('Playing expression:', expressionName);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // クリック位置に基づいてインタラクションを判定
    onInteraction?.('click', `${x},${y}`);
    playMotion('idle');
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">エラー</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        className="rounded-lg shadow-lg cursor-pointer"
        style={{ width, height }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">モデルを読み込み中...</p>
          </div>
        </div>
      )}

      {/* コントロールパネル */}
      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 rounded p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => playMotion('idle')}
            className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded hover:bg-opacity-30 transition-colors"
          >
            待機
          </button>
          <button
            onClick={() => playMotion('wave')}
            className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded hover:bg-opacity-30 transition-colors"
          >
            手を振る
          </button>
          <button
            onClick={() => playExpression('happy')}
            className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded hover:bg-opacity-30 transition-colors"
          >
            笑顔
          </button>
        </div>
      </div>
    </div>
  );
}
