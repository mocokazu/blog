export interface Live2DModel {
  id: string;
  name: string;
  description?: string;
  model_path: string;
  texture_paths: string[];
  physics_path?: string;
  pose_path?: string;
  expressions?: Live2DExpression[];
  motions?: Live2DMotion[];
  hit_areas?: Live2DHitArea[];
  settings: Live2DSettings;
  created_at: string;
  updated_at: string;
}

export interface Live2DExpression {
  name: string;
  file_path: string;
}

export interface Live2DMotion {
  group: string;
  name: string;
  file_path: string;
  fade_in?: number;
  fade_out?: number;
}

export interface Live2DHitArea {
  name: string;
  id: string;
}

export interface Live2DSettings {
  layout?: {
    center_x?: number;
    center_y?: number;
    width?: number;
    height?: number;
  };
  hit_areas_custom?: {
    head_x?: number;
    head_y?: number;
    body_x?: number;
    body_y?: number;
  };
}

export interface VRMModel {
  id: string;
  name: string;
  description?: string;
  model_path: string;
  thumbnail?: string;
  animations?: VRMAnimation[];
  settings: VRMSettings;
  created_at: string;
  updated_at: string;
}

export interface VRMAnimation {
  name: string;
  file_path: string;
  duration: number;
  loop: boolean;
}

export interface VRMSettings {
  scale?: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
  lighting?: {
    intensity: number;
    color: string;
  };
}

export interface Character {
  id: string;
  name: string;
  description?: string;
  type: 'live2d' | 'vrm';
  model_id: string;
  personality?: CharacterPersonality;
  voice_settings?: VoiceSettings;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  live2d_model?: Live2DModel;
  vrm_model?: VRMModel;
}

export interface CharacterPersonality {
  traits: string[];
  speaking_style: string;
  favorite_topics: string[];
  responses: CharacterResponse[];
}

export interface CharacterResponse {
  trigger: string;
  responses: string[];
  emotion?: string;
  motion?: string;
}

export interface VoiceSettings {
  voice_id?: string;
  speed: number;
  pitch: number;
  volume: number;
  language: string;
}

export interface CharacterInteraction {
  id: string;
  character_id: string;
  user_id?: string;
  interaction_type: 'click' | 'hover' | 'message' | 'gesture';
  trigger_area?: string;
  message?: string;
  response?: string;
  emotion?: string;
  motion?: string;
  created_at: string;
}
