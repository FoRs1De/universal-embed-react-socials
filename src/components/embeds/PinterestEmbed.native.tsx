import { resolveEmbedMaxWidth } from '../../utils/style';
import { getPinterestPinId } from '../../utils/urls';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { NativeEmbedView } from './NativeEmbedView';
import type { PinterestEmbedProps } from './PinterestEmbed.types';

export type { PinterestEmbedProps } from './PinterestEmbed.types';

const officialEmbedWidth = 450;
const officialEmbedHeight = 699;

export const PinterestEmbed = ({
  url,
  postUrl,
  maxWidth,
  width,
  height,
  linkText = 'View post on Pinterest',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  embedPlaceholder,
  placeholderDisabled = false,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: PinterestEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url: postUrl ?? url,
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
    extraStyle: { width: resolvedMaxWidth ?? '100%' },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: resolvedMaxWidth ?? '100%',
    providerHeight: height ?? officialEmbedHeight,
  });

  return (
    <NativeEmbedView
      uri={`https://assets.pinterest.com/ext/embed.html?id=${getPinterestPinId(postUrl ?? url)}&src=oembed`}
      width={resolvedMaxWidth}
      height={height}
      autoHeight
      fitDesignWidth={officialEmbedWidth}
      style={style}
      fallbackHeight={officialEmbedHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      openLinksInBrowser={openLinksInBrowser}
      webViewProps={webViewProps}
    />
  );
};
