export interface VideoThumbnailProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  views?: number;
  uploadDate?: string;
  width?: number;
  height?: number;
  className?: string;
}
