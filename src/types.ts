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
  /** Cap the embed width. The embed fills its container up to this size and shrinks with the viewport. */
  maxWidth?: string | number;
  /** @deprecated Use `maxWidth`. */
  width?: string | number;
  /** Omit to size the embed from the platform when possible. */
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
