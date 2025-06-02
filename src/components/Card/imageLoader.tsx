import { useState, useEffect } from 'react';

type ImageStatus = 'loading' | 'loaded' | 'error';

export function useImageLoader(src: string | undefined): ImageStatus {
  const [status, setStatus] = useState<ImageStatus>('loading');

  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setStatus('loaded');
    };
    
    img.onerror = () => {
      setStatus('error');
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return status;
}

export function getFallbackInitials(name: string): string {
  if (!name) return '?';
  
  const parts = name.split(/[\s.-]+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}