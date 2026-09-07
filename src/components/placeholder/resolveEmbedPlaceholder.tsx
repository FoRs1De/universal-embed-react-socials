import type { CSSProperties, ReactNode } from 'react';
import { Box } from '../../host';
import type { EmbedPlaceholder } from '../../types';
import { PlaceholderEmbed } from './PlaceholderEmbed';
import type { PlaceholderEmbedProps } from './PlaceholderEmbed.types';

export const unwrapEmbedPlaceholder = (value?: EmbedPlaceholder): ReactNode =>
  typeof value === 'function' ? value() : value;

export interface ResolveEmbedPlaceholderOptions {
  url?: string;
  linkText?: string;
  placeholder?: EmbedPlaceholder;
  embedPlaceholder?: EmbedPlaceholder;
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

export const placeholderBoxStyle = ({
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  placeholderProps,
  extraStyle,
  embedWidth,
  embedHeight,
  providerWidth,
  providerHeight,
}: Pick<
  ResolveEmbedPlaceholderOptions,
  | 'placeholderWidth'
  | 'placeholderHeight'
  | 'placeholderStyle'
  | 'placeholderProps'
  | 'extraStyle'
  | 'embedWidth'
  | 'embedHeight'
  | 'providerWidth'
  | 'providerHeight'
>): CSSProperties => ({
  boxSizing: 'border-box',
  maxWidth: '100%',
  ...extraStyle,
  width: placeholderWidth ?? embedWidth ?? providerWidth ?? extraStyle?.width ?? '100%',
  height: placeholderHeight ?? embedHeight ?? providerHeight ?? extraStyle?.height ?? '100%',
  ...placeholderStyle,
  ...placeholderProps?.style,
});

export const resolveEmbedPlaceholder = ({
  url,
  linkText,
  placeholder,
  embedPlaceholder,
  placeholderDisabled,
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled,
  placeholderProps,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  extraStyle,
  embedWidth,
  embedHeight,
  providerWidth,
  providerHeight,
  allowJavaScriptUrls,
}: ResolveEmbedPlaceholderOptions): ReactNode => {
  if (placeholderDisabled) {
    return null;
  }

  const boxStyle = placeholderBoxStyle({
    placeholderWidth,
    placeholderHeight,
    placeholderStyle,
    placeholderProps,
    extraStyle,
    embedWidth,
    embedHeight,
    providerWidth,
    providerHeight,
  });
  const fillStyle: CSSProperties = { width: '100%', height: '100%' };
  const explicit = placeholder !== undefined ? placeholder : embedPlaceholder;
  if (explicit !== undefined) {
    const custom = unwrapEmbedPlaceholder(explicit);
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
