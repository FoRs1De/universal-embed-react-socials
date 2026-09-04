import type { CSSProperties, ReactNode } from 'react';

export interface BoxProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  testID?: string;
  nativeID?: string;
  [key: string]: unknown;
}

export interface TextProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  numberOfLines?: number;
}

export interface LinkProps {
  href: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  target?: string;
  rel?: string;
}

export interface ImageProps {
  src: string;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

export interface IFrameProps {
  src: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
  scrolling?: string;
  frameBorder?: string | number;
  allow?: string;
  allowFullScreen?: boolean;
  title?: string;
}

export interface HtmlEmbedProps {
  html: string;
  baseUrl?: string;
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
  onLoad?: () => void;
  testID?: string;
}

export interface StyleTagProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
