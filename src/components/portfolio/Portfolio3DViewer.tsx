'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Portfolio, Scene3D } from '@/types/portfolio';
import { PortfolioService } from '@/lib/database/portfolios';

interface Portfolio3DViewerProps {
  sceneId?: string;
  onPortfolioSelect?: (portfolio: Portfolio) => void;
  className?: string;
}

export default function Portfolio3DViewer({
  sceneId,
  onPortfolioSelect,
  className = '',
}: Portfolio3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const [scene3D, setScene3D] = useState<Scene3D | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScene();
  }, [sceneId]);

  useEffect(() => {
    if (scene3D && mountRef.current) {
      initThreeJS();
    }

    return () => {
      cleanup();
    };
  }, [scene3D]);

  const loadScene = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [sceneData, portfolioData] = await Promise.all([
        PortfolioService.get3DScene(sceneId),
        PortfolioService.getPortfoliosFor3D(),
      ]);

      setScene3D(sceneData);
      setPortfolios(portfolioData);
    } catch (err) {
      console.error('Failed to load 3D scene:', err);
      setError('3Dシーンの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const initThreeJS = async () => {
    if (!mountRef.current || !scene3D) return;

    try {
      // シーンの作成
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(scene3D.environment.background_color);
      sceneRef.current = scene;

      // カメラの作成
      const camera = new THREE.PerspectiveCamera(
        scene3D.camera.fov,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        scene3D.camera.near,
        scene3D.camera.far
      );
      camera.position.set(
        scene3D.camera.position.x,
        scene3D.camera.position.y,
        scene3D.camera.position.z
      );
      cameraRef.current = camera;

      // レンダラーの作成
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      mountRef.current.appendChild(renderer.domElement);

      // ライティングの設定
      setupLighting(scene, scene3D.lighting);

      // 環境の設定
      setupEnvironment(scene, scene3D.environment);

      // ポートフォリオアイテムの配置
      setupPortfolioItems(scene, portfolios);

      // コントロールの設定（OrbitControlsのシミュレート）
      setupControls(camera, renderer.domElement);

      // リサイズハンドラー
      window.addEventListener('resize', handleResize);

      // アニメーションループの開始
      animate();
    } catch (err) {
      console.error('Failed to initialize 3D scene:', err);
      setError('3Dシーンの初期化に失敗しました');
    }
  };

  const setupLighting = (scene: THREE.Scene, lighting: any) => {
    // 環境光
    const ambientLight = new THREE.AmbientLight(
      lighting.ambient.color,
      lighting.ambient.intensity
    );
    scene.add(ambientLight);

    // 指向性ライト
    const directionalLight = new THREE.DirectionalLight(
      lighting.directional.color,
      lighting.directional.intensity
    );
    directionalLight.position.set(
      lighting.directional.position.x,
      lighting.directional.position.y,
      lighting.directional.position.z
    );
    directionalLight.castShadow = lighting.directional.cast_shadow;
    
    if (lighting.directional.cast_shadow) {
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
    }
    
    scene.add(directionalLight);

    // ポイントライト
    lighting.point_lights?.forEach((pointLight: any) => {
      const light = new THREE.PointLight(
        pointLight.color,
        pointLight.intensity,
        pointLight.distance,
        pointLight.decay
      );
      light.position.set(
        pointLight.position.x,
        pointLight.position.y,
        pointLight.position.z
      );
      scene.add(light);
    });
  };

  const setupEnvironment = (scene: THREE.Scene, environment: any) => {
    // 地面の作成
    if (environment.ground_texture) {
      const groundGeometry = new THREE.PlaneGeometry(20, 20);
      const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);
    }

    // フォグの設定
    if (environment.fog?.enabled) {
      scene.fog = new THREE.Fog(
        environment.fog.color,
        environment.fog.near,
        environment.fog.far
      );
    }
  };

  const setupPortfolioItems = (scene: THREE.Scene, portfolios: Portfolio[]) => {
    portfolios.forEach((portfolio, index) => {
      // ポートフォリオアイテムの3D表現を作成
      const geometry = new THREE.BoxGeometry(1, 1.5, 0.1);
      const material = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(index * 0.1, 0.7, 0.6) 
      });
      const mesh = new THREE.Mesh(geometry, material);

      // 位置の設定
      if (portfolio.position_3d) {
        mesh.position.set(
          portfolio.position_3d.x,
          portfolio.position_3d.y,
          portfolio.position_3d.z
        );
        
        if (portfolio.position_3d.rotation_y) {
          mesh.rotation.y = portfolio.position_3d.rotation_y;
        }
      } else {
        // デフォルト配置（円形）
        const angle = (index / portfolios.length) * Math.PI * 2;
        const radius = 5;
        mesh.position.set(
          Math.cos(angle) * radius,
          1,
          Math.sin(angle) * radius
        );
      }

      mesh.castShadow = true;
      mesh.userData = { portfolio };

      // クリックイベントの設定（userDataに保存）
      (mesh.userData as any).onClick = () => {
        setSelectedPortfolio(portfolio);
        onPortfolioSelect?.(portfolio);
      };

      scene.add(mesh);

      // ラベルの作成
      createPortfolioLabel(scene, portfolio, mesh.position);
    });
  };

  const createPortfolioLabel = (scene: THREE.Scene, portfolio: Portfolio, position: THREE.Vector3) => {
    // テキストラベルのプレースホルダー
    // 実際の実装では、THREE.js用のテキストライブラリを使用
    const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
    const labelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.8 
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(position.x, position.y + 1, position.z);
    label.lookAt(scene3D?.camera.position.x || 0, scene3D?.camera.position.y || 0, scene3D?.camera.position.z || 0);
    scene.add(label);
  };

  const setupControls = (camera: THREE.Camera, domElement: HTMLElement) => {
    // OrbitControlsのシミュレート
    // 実際の実装では、three/examples/jsm/controls/OrbitControlsを使用
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    domElement.addEventListener('mousedown', (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    domElement.addEventListener('mousemove', (event) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      // カメラの回転をシミュレート
      camera.position.x = Math.cos(deltaX * 0.01) * 10;
      camera.position.z = Math.sin(deltaX * 0.01) * 10;
      camera.lookAt(0, 0, 0);

      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    domElement.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
  };

  const handleResize = () => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };

  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(animate);
  };

  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    
    if (rendererRef.current && mountRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg min-h-96 ${className}`}>
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
        className="w-full h-96 rounded-lg overflow-hidden bg-gray-100"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">3D空間を読み込み中...</p>
          </div>
        </div>
      )}

      {/* ポートフォリオ詳細パネル */}
      {selectedPortfolio && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-bold text-lg mb-2">{selectedPortfolio.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{selectedPortfolio.description}</p>
          <div className="flex space-x-2">
            {selectedPortfolio.project_url && (
              <a
                href={selectedPortfolio.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-colors"
              >
                プロジェクト
              </a>
            )}
            {selectedPortfolio.github_url && (
              <a
                href={selectedPortfolio.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
              >
                GitHub
              </a>
            )}
          </div>
          <button
            onClick={() => setSelectedPortfolio(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* コントロールヘルプ */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
        マウスドラッグ: 回転 | クリック: 選択
      </div>
    </div>
  );
}
