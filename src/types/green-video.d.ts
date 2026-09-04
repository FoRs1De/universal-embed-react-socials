import type { CSSProperties, ReactNode } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'green-video': {
        'embed-id'?: string;
        'content-id'?: string;
        'mix-id'?: string;
        children?: ReactNode;
        style?: CSSProperties;
      };
    }
  }
}

export {};
