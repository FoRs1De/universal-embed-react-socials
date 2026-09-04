import type { CSSProperties, ReactNode } from 'react';

export interface Frame {
  window?: Window;
  document?: Document;
}

export interface EmbedContainerProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
  testID?: string;
  [key: string]: unknown;
}

/** Extra props forwarded to the native `WebView`. Ignored on web. */
export type EmbedWebViewProps = Record<string, unknown>;

export interface CommonEmbedProps extends EmbedContainerProps {
  url: string;
  width?: string | number;
  height?: string | number;
  linkText?: string;
  placeholderImageUrl?: string;
  placeholderSpinner?: ReactNode;
  placeholderSpinnerDisabled?: boolean;
  embedPlaceholder?: ReactNode;
  placeholderDisabled?: boolean;
  /** Extra `react-native-webview` props. Native only. */
  webViewProps?: EmbedWebViewProps;
}
