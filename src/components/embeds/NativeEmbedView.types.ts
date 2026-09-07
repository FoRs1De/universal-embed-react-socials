import type { ReactNode } from 'react';
import type { EmbedWebViewProps } from '../../types';

export interface NativeEmbedViewProps {
  html?: string;
  uri?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  width?: string | number;
  height?: string | number;
  aspectRatio?: number;
  /** Grow the WebView to the widget height. Off when `fitDesignWidth` or `aspectRatio` is set. */
  autoHeight?: boolean;
  /** Official embed width. The native box scales this design size to the layout width. */
  fitDesignWidth?: number;
  style?: unknown;
  fallbackHeight: number;
  placeholder?: ReactNode;
  placeholderDisabled?: boolean;
  allowsInlineMediaPlayback?: boolean;
  mediaPlaybackRequiresUserAction?: boolean;
  allowsFullscreenVideo?: boolean;
  openLinksInBrowser?: boolean;
  webViewProps?: EmbedWebViewProps;
}
