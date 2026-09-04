import type { CSSProperties } from 'react';

export const isPercentage = (value?: string | number): boolean => !!value?.toString().includes('%');

export const resolveEmbedMaxWidth = (
  maxWidth?: string | number,
  width?: string | number,
): string | number | undefined => maxWidth ?? width;

export const embedMaxWidthStyle = (
  maxWidth?: string | number,
  fallbackMax?: number,
): CSSProperties => {
  if (isPercentage(maxWidth)) {
    return { width: maxWidth, maxWidth: '100%' };
  }
  const size = typeof maxWidth === 'number' ? maxWidth : fallbackMax;
  return {
    width: size ?? '100%',
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
