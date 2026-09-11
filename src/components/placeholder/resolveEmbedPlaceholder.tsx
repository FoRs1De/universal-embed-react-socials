import type { CSSProperties, ReactNode } from 'react';
import { Box } from '../../host';
import type { EmbedPlaceholder } from '../../types';
import { PlaceholderEmbed } from './PlaceholderEmbed';
import type { PlaceholderEmbedProps } from './PlaceholderEmbed.types';

export interface ResolveEmbedPlaceholderOptions {
  url?: string;
  linkText?: string;
  placeholder?: EmbedPlaceholder;
  placeholderDisabled?: boolean;
  placeholderImageUrl?: string;
  placeholderSpinner?: ReactNode;
  placeholderSpinnerDisabled?: boolean;
  placeholderProps?: PlaceholderEmbedProps;
  placeholderWidth?: string | number;
  placeholderHeight?: string | number;
  placeholderStyle?: CSSProperties;
  extraStyle?: CSSProperties;
  /** Current embed box size. Used when the user does not set a placeholder size. */
  embedWidth?: string | number;
  embedHeight?: string | number;
  /** Provider default size when the embed has not measured yet. */
  providerWidth?: string | number;
  providerHeight?: string | number;
  allowJavaScriptUrls?: boolean;
}

const placeholderBoxStyle = ({
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  placeholderProps,
  extraStyle,
  embedWidth,
  embedHeight,
  providerWidth,
  providerHeight,
}: ResolveEmbedPlaceholderOptions): CSSProperties => ({
  boxSizing: 'border-box',
  maxWidth: '100%',
  ...extraStyle,
  width: placeholderWidth ?? embedWidth ?? providerWidth ?? extraStyle?.width ?? '100%',
  height: placeholderHeight ?? embedHeight ?? providerHeight ?? extraStyle?.height ?? '100%',
  ...placeholderStyle,
  ...placeholderProps?.style,
});

export const resolveEmbedPlaceholder = (options: ResolveEmbedPlaceholderOptions): ReactNode => {
  const {
    url,
    linkText,
    placeholder,
    placeholderDisabled,
    placeholderImageUrl,
    placeholderSpinner,
    placeholderSpinnerDisabled,
    placeholderProps,
    allowJavaScriptUrls,
  } = options;
  if (placeholderDisabled) {
    return null;
  }

  const boxStyle = placeholderBoxStyle(options);
  const fillStyle: CSSProperties = { width: '100%', height: '100%' };
  if (placeholder !== undefined) {
    const custom = typeof placeholder === 'function' ? placeholder() : placeholder;
    if (custom == null || custom === false) {
      return null;
    }
    return (
      <Box style={{ ...boxStyle, overflow: 'hidden' }}>
        <Box style={fillStyle}>{custom}</Box>
      </Box>
    );
  }

  return (
    <PlaceholderEmbed
      url={url ?? '#'}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      allowJavaScriptUrls={allowJavaScriptUrls}
      {...placeholderProps}
      style={{ ...fillStyle, ...boxStyle }}
    />
  );
};

export const resolveNativeEmbedPlaceholder = ({
  resolvedMaxWidth,
  height,
  fallbackHeight,
  extraStyle,
  ...options
}: ResolveEmbedPlaceholderOptions & {
  resolvedMaxWidth?: string | number;
  height?: string | number;
  fallbackHeight: number;
}): ReactNode =>
  resolveEmbedPlaceholder({
    ...options,
    extraStyle: { width: resolvedMaxWidth ?? '100%', ...extraStyle },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: resolvedMaxWidth ?? '100%',
    providerHeight: height ?? fallbackHeight,
  });
