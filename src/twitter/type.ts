export interface WorkerJson {
  success: boolean;
  tweet: {
    id: string;
    text?: string;
    author?: string;
    author_username?: string;
    profile_image?: string;
  };
  media: {
    type: 'photo' | 'video' | 'animated_gif';
    thumbnail?: string;
    best?: string; // best mp4
    variants?: Array<{
      url: string;
      bitrate?: number; // bps
      width?: number;
      height?: number;
      label?: string;   // e.g., "720p"
    }>;
  };
}
