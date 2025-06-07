// src/hooks/useClickOutside.ts
import { useEffect, useRef, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
  onClickOutside: () => void
): RefObject<T> {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickOutside]);
  
  return ref;
}