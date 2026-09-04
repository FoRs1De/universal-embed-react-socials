import { useMemo } from 'react';
import type { Frame } from '../types';

export type { Frame };

export const useFrame = (frame?: Frame): Frame =>
  useMemo(() => {
    if (frame) {
      return frame;
    }
    return {
      document: typeof document !== 'undefined' ? document : undefined,
      window: typeof window !== 'undefined' ? window : undefined,
    };
  }, [frame]);
