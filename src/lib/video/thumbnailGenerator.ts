// src/lib/video/thumbnailGenerator.ts
/**
 * This utility can be used to generate thumbnail sprite sheets for videos
 * It's meant to be used in a Node.js environment, not in the browser
 */
import { createCanvas, loadImage } from 'canvas';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

interface GenerateSpriteSheetOptions {
  videoPath: string;
  outputPath: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  interval: number; // seconds between thumbnails
  columns: number; // columns in the sprite sheet
  maxThumbnails?: number; // maximum number of thumbnails to generate
}

export async function generateThumbnailSpriteSheet(
  options: GenerateSpriteSheetOptions
): Promise<{
  spriteSheetPath: string;
  metadata: {
    width: number;
    height: number;
    interval: number;
    columns: number;
    totalFrames: number;
  };
}> {
  const { 
    videoPath, 
    outputPath, 
    thumbnailWidth, 
    thumbnailHeight, 
    interval, 
    columns,
    maxThumbnails = 100
  } = options;

  // Get video duration
  const duration = await getVideoDuration(videoPath);
  
  // Calculate number of thumbnails
  const totalFrames = Math.min(
    Math.ceil(duration / interval),
    maxThumbnails
  );
  
  // Calculate rows needed
  const rows = Math.ceil(totalFrames / columns);
  
  // Create canvas for sprite sheet
  const canvas = createCanvas(thumbnailWidth * columns, thumbnailHeight * rows);
  const ctx = canvas.getContext('2d');
  
  // Generate thumbnails and place on canvas
  for (let i = 0; i < totalFrames; i++) {
    const time = i * interval;
    const thumbnailPath = `${outputPath}_thumb_${i}.jpg`;
    
    // Generate thumbnail with ffmpeg
    await generateThumbnail(videoPath, thumbnailPath, time, thumbnailWidth, thumbnailHeight);
    
    // Load thumbnail and place on canvas
    const thumbnail = await loadImage(thumbnailPath);
    const col = i % columns;
    const row = Math.floor(i / columns);
    ctx.drawImage(
      thumbnail, 
      col * thumbnailWidth, 
      row * thumbnailHeight, 
      thumbnailWidth, 
      thumbnailHeight
    );
    
    // Clean up individual thumbnail file
    await fs.promises.unlink(thumbnailPath);
  }
  
  // Save sprite sheet
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
  await fs.promises.writeFile(`${outputPath}.jpg`, buffer);
  
  return {
    spriteSheetPath: `${outputPath}.jpg`,
    metadata: {
      width: thumbnailWidth,
      height: thumbnailHeight,
      interval,
      columns,
      totalFrames
    }
  };
}

// Helper functions
function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
}

function generateThumbnail(
  videoPath: string, 
  outputPath: string, 
  timeInSeconds: number,
  width: number,
  height: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timeInSeconds],
        filename: outputPath,
        size: `${width}x${height}`
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
}

// Example usage function (for documentation)
export async function generateVideoThumbnails(videoPath: string): Promise<void> {
  try {
    const result = await generateThumbnailSpriteSheet({
      videoPath,
      outputPath: './public/thumbnails/sprite',
      thumbnailWidth: 160,
      thumbnailHeight: 90,
      interval: 10, // Every 10 seconds
      columns: 10,
      maxThumbnails: 50
    });
    
    console.log('Sprite sheet generated:', result.spriteSheetPath);
    console.log('Metadata:', result.metadata);
  } catch (error) {
    console.error('Error generating thumbnails:', error);
  }
}