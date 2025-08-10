'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { VRMModel } from '@/types/character';

interface VRMViewerProps {
  model: VRMModel;
  width?: number;
  height?: number;
  onInteraction?: (type: string) => void;
  className?: string;
}

export default function VRMViewer({
  model,
  width = 400,
  height = 500,
  onInteraction,
  className = '',
}: VRMViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const vrmRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const initThreeJS = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // シーンの作成
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        sceneRef.current = scene;

        // カメラの作成
        const camera = new THREE.PerspectiveCamera(
          45,
          width / height,
          0.1,
          1000
        );
        camera.position.set(0, 1.5, 3);
        cameraRef.current = camera;

        // レンダラーの作成
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        if (mountRef.current) {
          mountRef.current.appendChild(renderer.domElement);
        }

        // ライティングの設定
        setupLighting(scene);

        // VRMモデルの読み込みをシミュレート
        await loadVRMModel(scene, model);

        // アニメーションループの開始
        animate();

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize VRM viewer:', err);
        setError('VRMビューアーの初期化に失敗しました');
        setIsLoading(false);
      }
    };

    initThreeJS();

    return () => {
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [model, width, height]);

  const setupLighting = (scene: THREE.Scene) => {
    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 指向性ライト
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // リムライト
    const rimLight = new THREE.DirectionalLight(0x4080ff, 0.3);
    rimLight.position.set(-1, 1, -1);
    scene.add(rimLight);
  };

  const loadVRMModel = async (scene: THREE.Scene, model: VRMModel) => {
    // VRMモデルの読み込みをシミュレート
    // 実際の実装では、@pixiv/three-vrmを使用
    await new Promise(resolve => setTimeout(resolve, 1500));

    // プレースホルダーとして簡単なジオメトリを作成
    const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
    const material = new THREE.MeshLambertMaterial({ color: 0x8080ff });
    const placeholder = new THREE.Mesh(geometry, material);
    placeholder.position.y = 0.75;
    placeholder.castShadow = true;
    
    scene.add(placeholder);
    vrmRef.current = placeholder;

    console.log('VRM model loaded:', model.name);
  };

  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // VRMモデルのアニメーション更新
    if (vrmRef.current) {
      vrmRef.current.rotation.y += 0.005;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(animate);
  };

  const playAnimation = (animationName: string) => {
    console.log('Playing VRM animation:', animationName);
    onInteraction?.('animation');
  };

  const handleModelClick = () => {
    onInteraction?.('click');
    playAnimation('wave');
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
      <div
        ref={mountRef}
        onClick={handleModelClick}
        className="rounded-lg shadow-lg cursor-pointer overflow-hidden"
        style={{ width, height }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">VRMモデルを読み込み中...</p>
          </div>
        </div>
      )}

      {/* コントロールパネル */}
      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 rounded p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => playAnimation('idle')}
            className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded hover:bg-opacity-30 transition-colors"
          >
            待機
          </button>
          <button
            onClick={() => playAnimation('wave')}
            className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded hover:bg-opacity-30 transition-colors"
          >
            手を振る
          </button>
          <button
            onClick={() => playAnimation('dance')}
            className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded hover:bg-opacity-30 transition-colors"
          >
            ダンス
          </button>
        </div>
      </div>
    </div>
  );
}
