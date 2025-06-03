// src/components/video/Player/ResponsivePlayerWrapper.tsx
import React, { FC, ReactNode } from 'react';

interface ResponsivePlayerWrapperProps {
  children: ReactNode;
  className?: string;
  maintainAspectRatio?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
  maxWidth?: string;
}

/**
 * ResponsivePlayerWrapper - A component that wraps the video player and provides
 * responsive behavior at different breakpoints.
 *
 * Mobile: 100% width
 * Tablet: 90% width
 * Desktop: custom maxWidth (default: 800px)
 */
export const ResponsivePlayerWrapper: FC<ResponsivePlayerWrapperProps> = ({
  children,
  className = '',
  maintainAspectRatio = true,
  aspectRatio = '16:9',
  maxWidth = '800px',
}) => {
  // Define aspect ratio styles
  const aspectRatioClasses: Record<string, string> = {
    '16:9': 'aspect-w-16 aspect-h-9',
    '4:3': 'aspect-w-4 aspect-h-3',
    '1:1': 'aspect-w-1 aspect-h-1',
    '21:9': 'aspect-w-21 aspect-h-9',
  };

  const aspectRatioClass = maintainAspectRatio ? aspectRatioClasses[aspectRatio] : '';

  return (
    <div
      className={`
        responsive-player-wrapper
        w-full px-4 sm:px-0 sm:w-[90%] mx-auto
        ${className}
      `}
      style={{
        maxWidth: maxWidth,
      }}
    >
      <div
        className={`
          player-container
          w-full h-auto relative
          ${aspectRatioClass}
          overflow-hidden rounded-lg
          shadow-lg
        `}
        data-testid="responsive-player-container"
      >
        {children}
      </div>
    </div>
  );
};

/**
 * This alternative implementation uses CSS custom properties for more flexibility
 * in customizing responsive behavior via props.
 */
export const ResponsivePlayerWrapperWithVars: FC<
  ResponsivePlayerWrapperProps & {
    mobileWidth?: string;
    tabletWidth?: string;
    mobilePadding?: string;
    tabletPadding?: string;
  }
> = ({
  children,
  className = '',
  maintainAspectRatio = true,
  aspectRatio = '16:9',
  maxWidth = '800px',
  mobileWidth = '100%',
  tabletWidth = '90%',
  mobilePadding = '1rem',
  tabletPadding = '0',
}) => {
  // Calculate aspect ratio for CSS custom property
  const aspectRatioParts = aspectRatio.split(':');
  const aspectRatioValue = (Number(aspectRatioParts[1]) / Number(aspectRatioParts[0])) * 100;

  return (
    <div
      className={`responsive-player-wrapper-custom ${className}`}
      style={
        {
          '--mobile-width': mobileWidth,
          '--tablet-width': tabletWidth,
          '--mobile-padding': mobilePadding,
          '--tablet-padding': tabletPadding,
          '--max-width': maxWidth,
          '--aspect-ratio': maintainAspectRatio ? `${aspectRatioValue}%` : 'auto',
          width: '100%',
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: 'var(--mobile-padding)',
        } as React.CSSProperties
      }
    >
      <div
        className="player-container relative overflow-hidden rounded-lg shadow-lg"
        style={{
          width: '100%',
          ...(maintainAspectRatio && {
            paddingTop: 'var(--aspect-ratio)',
            height: 0,
          }),
        }}
        data-testid="responsive-player-container-custom"
      >
        <div className={maintainAspectRatio ? 'absolute inset-0' : ''}>{children}</div>
      </div>

      {/* Responsive styles injected via styled component */}
      <style jsx>{`
        @media (min-width: 640px) {
          .responsive-player-wrapper-custom {
            width: var(--tablet-width);
            padding: var(--tablet-padding);
          }
        }
      `}</style>
    </div>
  );
};

export default ResponsivePlayerWrapper;
