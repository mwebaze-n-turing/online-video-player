// src/components/video/Controls/ControlButton.tsx
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import cx from 'classnames';

interface ControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  activeIcon?: ReactNode;
  isActive?: boolean;
  label: string;
  variant?: 'primary' | 'secondary';
}

const ControlButton: React.FC<ControlButtonProps> = ({
  icon,
  activeIcon,
  isActive = false,
  label,
  variant = 'primary',
  className,
  ...props
}) => {
  return (
    <button
      className={cx(
        // Base styles
        'relative flex items-center justify-center',
        'rounded-full p-2 focus:outline-none',
        'transition-all duration-200',

        // Size transform animations
        'hover:scale-110 active:scale-95',

        // Accessibility focus styles
        'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-75',

        // Color transitions based on variant
        variant === 'primary'
          ? ['text-white bg-black bg-opacity-0', 'hover:bg-opacity-20', 'active:bg-opacity-30']
          : ['text-gray-300 bg-gray-700 bg-opacity-50', 'hover:text-white hover:bg-opacity-70', 'active:bg-opacity-90'],

        // Active state styles
        isActive && 'text-blue-400 hover:text-blue-300',

        // Custom classes
        className
      )}
      aria-label={label}
      {...props}
    >
      <span className="transition-transform duration-200">{isActive && activeIcon ? activeIcon : icon}</span>
      <span className="absolute inset-0 rounded-full pointer-events-none touch-ripple" />
    </button>
  );
};

export default ControlButton;
