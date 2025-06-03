// src/components/common/Skeleton/index.tsx
import { FC } from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
};

export const Skeleton: FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  rounded = 'md',
  animate = true
}) => {
  return (
    <div 
      className={`
        bg-gray-200 dark:bg-gray-700
        ${width} ${height} ${roundedClasses[rounded]} ${className}
        ${animate ? 'animate-pulse' : ''}
      `}
      aria-hidden="true"
    />
  );
};

export const SkeletonText: FC<SkeletonProps & { lines?: number }> = ({ 
  lines = 1, 
  width = 'w-full', 
  height = 'h-4',
  className = '',
  rounded = 'md',
  animate = true
}) => {
  return (
    <div className="flex flex-col space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 && lines > 1 ? 'w-4/5' : width}
          height={height}
          className={className}
          rounded={rounded}
          animate={animate}
        />
      ))}
    </div>
  );
};

export default { Skeleton, SkeletonText };