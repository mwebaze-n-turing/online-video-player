// src/app/_providers.tsx
'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Import theme styles
import '@/styles/themes/index.css';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export default Providers;
