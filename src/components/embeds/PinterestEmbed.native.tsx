import { resolveEmbedMaxWidth } from '../../utils/style';
import { resolveNativeEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { pinterestEmbedHtml } from './embedHtml';
import { NativeEmbedView } from './NativeEmbedView';
import type { PinterestEmbedProps } from './PinterestEmbed.types';

export type { PinterestEmbedProps } from './PinterestEmbed.types';

const officialEmbedHeight = 900;

export const PinterestEmbed = ({
  url,
  postUrl,
  maxWidth,
  height,
  placeholderText = 'View post on Pinterest',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  placeholderDisabled = false,
  embedDisabled = false,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: PinterestEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth);
  const resolvedPlaceholder = resolveNativeEmbedPlaceholder({
    url: postUrl ?? url,
    placeholderText,
    placeholder,
    placeholderDisabled,
    placeholderImageUrl,
    placeholderSpinner,
    placeholderSpinnerDisabled,
    placeholderProps,
    placeholderWidth,
    placeholderHeight,
    placeholderStyle,
    resolvedMaxWidth,
    height,
    fallbackHeight: officialEmbedHeight,
  });

  return (
    <NativeEmbedView
      html={pinterestEmbedHtml({ url: postUrl ?? url, fillWidth: true })}
      baseUrl="https://www.pinterest.com"
      width={resolvedMaxWidth}
      height={height}
      autoHeight
      style={style}
      fallbackHeight={officialEmbedHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      embedDisabled={embedDisabled}
      openLinksInBrowser={openLinksInBrowser}
      webViewProps={webViewProps}
    />
  );
};
