import type { CSSProperties, ReactNode } from 'react';

/** Custom loading UI, or a render function. Return `null` to reserve no space. */
export type EmbedPlaceholder = ReactNode | (() => ReactNode);

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
  /** Cap the embed width. On web the embed is `100%` of its container by default; pass a pixel or percent value to cap it. */
  maxWidth?: string | number;
  /** Omit to size the embed from the platform when possible. */
  height?: string | number;
  linkText?: string;
  /** Custom loading placeholder. Wins over the default UI. Pass `null` or `() => null` to render nothing and reserve no height. */
  placeholder?: EmbedPlaceholder;
  placeholderImageUrl?: string;
  placeholderSpinner?: ReactNode;
  placeholderSpinnerDisabled?: boolean;
  /** Width of the placeholder box. Defaults to the embed width, then the provider default. */
  placeholderWidth?: string | number;
  /** Height of the placeholder box. Defaults to the embed height, then the provider default. */
  placeholderHeight?: string | number;
  placeholderStyle?: CSSProperties;
  placeholderDisabled?: boolean;
  /**
   * When true, keep the placeholder and do not load the live embed
   * (iframe, WebView, or provider scripts). Default `false`.
   */
  embedDisabled?: boolean;
  /** Extra `react-native-webview` props. Native only. */
  webViewProps?: EmbedWebViewProps;
  /**
   * React Native only. Open tapped embed links in the system browser instead of the WebView.
   * Defaults to `true`. Ignored on web.
   */
  openLinksInBrowser?: boolean;
}
