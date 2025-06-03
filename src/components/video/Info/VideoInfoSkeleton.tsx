// src/components/video/Info/VideoInfoSkeleton.tsx
import { FC } from 'react';
import { Skeleton, SkeletonText } from '@/components/common/Skeleton';

interface VideoInfoSkeletonProps {
  className?: string;
}

export const VideoInfoSkeleton: FC<VideoInfoSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`video-info-skeleton ${className}`}>
      {/* Title skeleton */}
      <Skeleton height="h-8" className="mb-4" rounded="md" />

      {/* Meta info skeleton (views, date) */}
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton width="w-24" height="h-4" rounded="md" />
        <Skeleton width="w-4" height="h-4" rounded="full" />
        <Skeleton width="w-32" height="h-4" rounded="md" />
      </div>

      {/* Description skeleton */}
      <div className="mb-6">
        <SkeletonText lines={4} height="h-4" className="mb-1" rounded="md" />
      </div>

      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map(index => (
          <Skeleton key={index} width={`w-${16 + (index % 3) * 4}`} height="h-6" rounded="full" />
        ))}
      </div>
    </div>
  );
};

export default VideoInfoSkeleton;
