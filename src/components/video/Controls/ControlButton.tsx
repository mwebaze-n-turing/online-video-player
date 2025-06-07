// src/components/video/Controls/ControlButton.tsx
import React, { ReactNode } from 'react';
import { Tooltip } from '../../common/Tooltip';

interface ControlButtonProps {
  onClick: () => void;
  tooltipText: string; // Text to display in tooltip
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const ControlButton = ({
  onClick,
  tooltipText,
  children,
  className = '',
  disabled = false,
  ariaLabel,
}: ControlButtonProps) => {
  return (
    <Tooltip text={tooltipText}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative flex items-center justify-center
          rounded-full p-2 focus:outline-none
          transition-all duration-200
          hover:scale-110 active:scale-95
          focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-75
          text-white bg-black bg-opacity-0 hover:bg-opacity-20 active:bg-opacity-30
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        aria-label={ariaLabel || tooltipText}
      >
        {children}
      </button>
    </Tooltip>
  );
};
