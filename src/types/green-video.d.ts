import type { CSSProperties, ReactNode } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'green-video': {
        'embed-id'?: string;
        'content-id'?: string;
        'mix-id'?: string;
        'ad-tag-url'?: string;
        'ads-disallowed'?: string;
        'consent-string'?: string;
        environment?: string;
        children?: ReactNode;
        style?: CSSProperties;
        [key: string]: unknown;
      };
    }
  }
}

export {};
