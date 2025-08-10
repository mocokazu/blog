export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  cover_image?: string;
  images: string[];
  project_url?: string;
  github_url?: string;
  demo_url?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  technologies: Technology[];
  category_id?: string;
  position_3d?: Position3D;
  model_3d?: Model3D;
  created_at: string;
  updated_at: string;
  
  // Relations
  category?: PortfolioCategory;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'other';
  proficiency: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  updated_at: string;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
  rotation_x?: number;
  rotation_y?: number;
  rotation_z?: number;
  scale?: number;
}

export interface Model3D {
  id: string;
  name: string;
  file_path: string;
  thumbnail?: string;
  type: 'gltf' | 'glb' | 'obj' | 'fbx';
  animations?: Animation3D[];
  materials?: Material3D[];
  settings: Model3DSettings;
  created_at: string;
  updated_at: string;
}

export interface Animation3D {
  name: string;
  duration: number;
  loop: boolean;
  auto_play: boolean;
}

export interface Material3D {
  name: string;
  color?: string;
  texture?: string;
  metalness?: number;
  roughness?: number;
  opacity?: number;
}

export interface Model3DSettings {
  scale: number;
  position: Position3D;
  lighting: {
    ambient_intensity: number;
    directional_intensity: number;
    directional_position: Position3D;
  };
  shadows: boolean;
  wireframe: boolean;
}

export interface Scene3D {
  id: string;
  name: string;
  description?: string;
  environment: Environment3D;
  lighting: Lighting3D;
  camera: Camera3D;
  portfolios: Portfolio[];
  created_at: string;
  updated_at: string;
}

export interface Environment3D {
  skybox?: string;
  ground_texture?: string;
  fog?: {
    enabled: boolean;
    color: string;
    near: number;
    far: number;
  };
  background_color: string;
}

export interface Lighting3D {
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: Position3D;
    cast_shadow: boolean;
  };
  point_lights?: PointLight3D[];
}

export interface PointLight3D {
  color: string;
  intensity: number;
  position: Position3D;
  distance: number;
  decay: number;
}

export interface Camera3D {
  position: Position3D;
  target: Position3D;
  fov: number;
  near: number;
  far: number;
  controls: {
    enabled: boolean;
    auto_rotate: boolean;
    auto_rotate_speed: number;
    enable_zoom: boolean;
    enable_pan: boolean;
    min_distance: number;
    max_distance: number;
  };
}
