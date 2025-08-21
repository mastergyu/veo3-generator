
export interface VideoConfig {
  model: 'veo-3.0-fast-generate-preview' | 'veo-3.0-generate-001' | 'veo-2.0-generate-001';
  aspectRatio: '16:9' | '9:16';
  enableSound: boolean; 
  resolution: '720p' | '1080p';
  numberOfVideos: number;
  allowAllAge: boolean;
}

export interface VideoResult {
  id: string;
  videoUrl: string;
  prompt: string;
  imageName?: string;
  config: VideoConfig;
}
