export interface ThumbnailData {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  views?: number;
  uploadDate?: string;
}

export const sampleThumbnails: ThumbnailData[] = [
  {
    id: 'video-1',
    title: 'Getting Started with Next.js 15',
    thumbnailUrl: '/thumbnails/nextjs-intro.jpg',
    duration: 358, // 5:58
    views: 12500,
    uploadDate: '2025-05-15',
  },
  {
    id: 'video-2',
    title: 'Advanced Video Player Implementation with React Hooks',
    thumbnailUrl: '/thumbnails/react-video.jpg',
    duration: 742, // 12:22
    views: 8700,
    uploadDate: '2025-05-20',
  },
  {
    id: 'video-3',
    title: 'CSS Grid vs Flexbox: Which One to Choose?',
    thumbnailUrl: '/thumbnails/css-grid-flexbox.jpg',
    duration: 485, // 8:05
    views: 45200,
    uploadDate: '2025-04-28',
  },
  {
    id: 'video-4',
    title: 'TypeScript Tips and Tricks for React Developers',
    thumbnailUrl: '/thumbnails/typescript-react.jpg',
    duration: 915, // 15:15
    views: 32100,
    uploadDate: '2025-05-10',
  },
  {
    id: 'video-5',
    title: 'Building a Responsive UI with Tailwind CSS',
    thumbnailUrl: '/thumbnails/tailwind-ui.jpg',
    duration: 623, // 10:23
    views: 19800,
    uploadDate: '2025-05-25',
  },
  {
    id: 'video-6',
    title: 'Introduction to Server Components in Next.js',
    thumbnailUrl: '/thumbnails/server-components.jpg',
    duration: 1247, // 20:47
    views: 7500,
    uploadDate: '2025-05-28',
  },
  {
    id: 'video-7',
    title: 'State Management in React: Context API vs Redux',
    thumbnailUrl: '/thumbnails/state-management.jpg',
    duration: 832, // 13:52
    views: 28400,
    uploadDate: '2025-05-05',
  },
  {
    id: 'video-8',
    title: 'Performance Optimization Techniques for React Applications',
    thumbnailUrl: '/thumbnails/performance-react.jpg',
    duration: 1124, // 18:44
    views: 15700,
    uploadDate: '2025-05-18',
  },
];

// We need fallback URLs in case the /thumbnails/* images don't exist in the public folder
export const fallbackThumbnails: ThumbnailData[] = [
  {
    id: 'video-1',
    title: 'Getting Started with Next.js 15',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop',
    duration: 358, // 5:58
    views: 12500,
    uploadDate: '2025-05-15',
  },
  {
    id: 'video-2',
    title: 'Advanced Video Player Implementation with React Hooks',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    duration: 742, // 12:22
    views: 8700,
    uploadDate: '2025-05-20',
  },
  {
    id: 'video-3',
    title: 'CSS Grid vs Flexbox: Which One to Choose?',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=1974&auto=format&fit=crop',
    duration: 485, // 8:05
    views: 45200,
    uploadDate: '2025-04-28',
  },
  {
    id: 'video-4',
    title: 'TypeScript Tips and Tricks for React Developers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=2070&auto=format&fit=crop',
    duration: 915, // 15:15
    views: 32100,
    uploadDate: '2025-05-10',
  },
  {
    id: 'video-5',
    title: 'Building a Responsive UI with Tailwind CSS',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560859251-a3ea91a7bd3a?q=80&w=2070&auto=format&fit=crop',
    duration: 623, // 10:23
    views: 19800,
    uploadDate: '2025-05-25',
  },
  {
    id: 'video-6',
    title: 'Introduction to Server Components in Next.js',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    duration: 1247, // 20:47
    views: 7500,
    uploadDate: '2025-05-28',
  },
  {
    id: 'video-7',
    title: 'State Management in React: Context API vs Redux',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566241477600-ac026ad43874?q=80&w=2126&auto=format&fit=crop',
    duration: 832, // 13:52
    views: 28400,
    uploadDate: '2025-05-05',
  },
  {
    id: 'video-8',
    title: 'Performance Optimization Techniques for React Applications',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2021&auto=format&fit=crop',
    duration: 1124, // 18:44
    views: 15700,
    uploadDate: '2025-05-18',
  },
];
