import { resolveEmbedMaxWidth } from '../../utils/style';
import { resolveNativeEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { pinterestEmbedHtml } from './embedHtml';
import { NativeEmbedView } from './NativeEmbedView';
import type { PinterestEmbedProps } from './PinterestEmbed.types';

export type { PinterestEmbedProps } from './PinterestEmbed.types';

const officialEmbedWidth = 600;
const officialEmbedHeight = 900;

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
  embedDisabled = false,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: PinterestEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const resolvedPlaceholder = resolveNativeEmbedPlaceholder({
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
    resolvedMaxWidth,
    height,
    fallbackHeight: officialEmbedHeight,
  });

  return (
    <NativeEmbedView
      html={pinterestEmbedHtml({ url: postUrl ?? url })}
      baseUrl="https://www.pinterest.com"
      width={resolvedMaxWidth ?? '100%'}
      height={height}
      autoHeight
      fitDesignWidth={officialEmbedWidth}
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
