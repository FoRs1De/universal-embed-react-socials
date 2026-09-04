import { resolveEmbedMaxWidth } from '../../utils/style';
import { getPinterestPinId } from '../../utils/urls';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { NativeEmbedView } from './NativeEmbedView';
import type { PinterestEmbedProps } from './PinterestEmbed.types';

export type { PinterestEmbedProps } from './PinterestEmbed.types';

const defaultPlaceholderHeight = 550;

export const PinterestEmbed = ({
  url,
  postUrl,
  maxWidth,
  width,
  height = 500,
  linkText = 'View post on Pinterest',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled = false,
  style,
  webViewProps,
}: PinterestEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={postUrl ?? url}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      {...placeholderProps}
      style={{
        width: resolvedMaxWidth ?? '100%',
        height: height ?? defaultPlaceholderHeight,
        ...placeholderProps?.style,
      }}
    />
  );

  return (
    <NativeEmbedView
      uri={`https://assets.pinterest.com/ext/embed.html?id=${getPinterestPinId(url)}&src=oembed`}
      width={resolvedMaxWidth}
      height={height}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={placeholder}
      placeholderDisabled={placeholderDisabled}
      webViewProps={webViewProps}
    />
  );
};
