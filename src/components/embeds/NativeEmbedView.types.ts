import type { ReactNode } from 'react';
import type { EmbedWebViewProps } from '../../types';

export interface NativeEmbedViewProps {
  html?: string;
  uri?: string;
  baseUrl?: string;
  width?: string | number;
  height?: string | number;
  style?: unknown;
  fallbackHeight: number;
  placeholder?: ReactNode;
  placeholderDisabled?: boolean;
  allowsInlineMediaPlayback?: boolean;
  mediaPlaybackRequiresUserAction?: boolean;
  allowsFullscreenVideo?: boolean;
  webViewProps?: EmbedWebViewProps;
}
