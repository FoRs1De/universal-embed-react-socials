import type { CSSProperties } from 'react';

export const aspectRatioHeight = (
  width: string | number | undefined,
  ratio = 16 / 9,
  fallback = 360,
): number => {
  if (typeof width === 'number' && width > 0) {
    return Math.round(width / ratio);
  }
  return fallback;
};

export const isPercentage = (value?: string | number): boolean => !!value?.toString().includes('%');

export const resolveEmbedFrame = ({
  ready,
  measuredHeight,
  fallbackHeight,
  scale = 1,
  height,
  waitForMeasure = true,
}: {
  ready: boolean;
  measuredHeight?: number;
  fallbackHeight: number;
  scale?: number;
  height?: string | number;
  waitForMeasure?: boolean;
}): { frameHeight: string | number; showPlaceholder: boolean } => {
  if (height != null && !isPercentage(height)) {
    return { frameHeight: height, showPlaceholder: !ready };
  }
  if (isPercentage(height)) {
    return { frameHeight: '100%', showPlaceholder: !ready };
  }
  const scaledFallback = Math.round(fallbackHeight * scale);
  const scaledMeasured =
    typeof measuredHeight === 'number' ? Math.round(measuredHeight * scale) : undefined;
  const reveal = ready && (!waitForMeasure || scaledMeasured != null);
  return {
    frameHeight: reveal && scaledMeasured != null ? scaledMeasured : scaledFallback,
    showPlaceholder: !reveal,
  };
};

export const placeholderOverlayStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  overflow: 'hidden',
};

/** Web embeds fill the parent unless `maxWidth` is set. */
export const DEFAULT_WEB_EMBED_WIDTH = '100%';

export const resolveEmbedMaxWidth = (maxWidth?: string | number): string | number =>
  maxWidth ?? DEFAULT_WEB_EMBED_WIDTH;

export const embedMaxWidthStyle = (
  maxWidth?: string | number,
  fallbackMax?: number,
): CSSProperties => {
  if (isPercentage(maxWidth) || maxWidth == null) {
    return { width: maxWidth ?? DEFAULT_WEB_EMBED_WIDTH, maxWidth: '100%' };
  }
  const size = typeof maxWidth === 'number' ? maxWidth : fallbackMax;
  return {
    width: size ?? DEFAULT_WEB_EMBED_WIDTH,
    maxWidth: '100%',
  };
};

export const embedScaleStyle = (scale: number, designWidth: number): CSSProperties => ({
  width: designWidth,
  transform: `scale(${scale})`,
  transformOrigin: 'top left',
});

export const toNativeSize = (value: string | number | undefined, fallback: number): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string' && !value.includes('%')) {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return fallback;
};

export const collapsedEmbedStyle = (collapsed: boolean): CSSProperties =>
  collapsed ? { height: 0, minHeight: 0, overflow: 'hidden' } : {};

export const boxSizeStyle = (
  width?: string | number,
  height?: string | number,
  extra?: CSSProperties,
): CSSProperties => ({
  overflow: 'hidden',
  width: width ?? undefined,
  height: height ?? undefined,
  ...extra,
});
