import type { CSSProperties, ReactNode } from 'react';

export interface PlaceholderEmbedProps {
  url: string;
  linkText?: string;
  imageUrl?: string;
  spinner?: ReactNode;
  spinnerDisabled?: boolean;
  allowJavaScriptUrls?: boolean;
  className?: string;
  style?: CSSProperties;
}
