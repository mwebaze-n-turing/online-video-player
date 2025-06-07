// src/data/sampleChapters.ts
import { Chapter } from '@/types/video';

export const sampleChapters: Chapter[] = [
  {
    id: 'intro',
    title: 'Introduction',
    startTime: 0,
    description: 'Welcome to the video tutorial',
    color: '#4f46e5' // indigo
  },
  {
    id: 'part1',
    title: 'Getting Started',
    startTime: 45,
    description: 'Essential setup and configuration',
    color: '#059669' // emerald
  },
  {
    id: 'part2',
    title: 'Core Concepts',
    startTime: 130,
    description: 'Understanding the fundamentals',
    color: '#0284c7' // sky blue
  },
  {
    id: 'part3',
    title: 'Advanced Techniques',
    startTime: 215,
    description: 'Taking your skills to the next level',
    color: '#7c3aed' // violet
  },
  {
    id: 'part4',
    title: 'Real-world Examples',
    startTime: 310,
    description: 'Practical applications in production environments',
    color: '#db2777' // pink
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    startTime: 400,
    description: 'Final thoughts and next steps',
    color: '#ea580c' // orange
  }
];

// You can use this function to automatically set endTimes
export function processChapters(chapters: Chapter[]): Chapter[] {
  return chapters
    .sort((a, b) => a.startTime - b.startTime)
    .map((chapter, index, arr) => ({
      ...chapter,
      endTime: index < arr.length - 1 ? arr[index + 1].startTime : undefined
    }));
}