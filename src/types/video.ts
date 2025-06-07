// src/types/video.ts
export interface Chapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime?: number;  // optional, can be inferred from next chapter
  description?: string;
  thumbnail?: string; // optional thumbnail URL
  color?: string;    // optional color to distinguish chapter
}