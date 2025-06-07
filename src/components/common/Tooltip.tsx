import React, { ReactNode, useState } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

export const Tooltip = ({
  children,
  text,
  position = 'top',
  delay = 300,
  className = '',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Generate arrow classes based on position
  const arrowClasses = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800',
    left: 'right-[-4px] top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800',
    right: 'left-[-4px] top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setTimeout(() => setIsVisible(true), delay)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      <div 
        className={`
          absolute z-50 pointer-events-none
          ${positionClasses[position]}
          transition-opacity duration-200
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          {text}
          <span className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
        </div>
      </div>
    </div>
  );
};