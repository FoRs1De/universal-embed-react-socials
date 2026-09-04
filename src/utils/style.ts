import type { CSSProperties } from 'react';

export const isPercentage = (value?: string | number): boolean => !!value?.toString().includes('%');

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
