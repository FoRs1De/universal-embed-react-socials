import { resolveEmbedMaxWidth } from '../../utils/style';
import { resolveNativeEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { PINTEREST_DESIGN_WIDTH, pinterestEmbedHtml } from './embedHtml';
import { NativeEmbedView } from './NativeEmbedView';
import type { PinterestEmbedProps } from './PinterestEmbed.types';

export type { PinterestEmbedProps } from './PinterestEmbed.types';

const officialEmbedHeight = 900;

export const PinterestEmbed = ({
  url,
  postUrl,
  maxWidth,
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
  placeholderDisabled = false,
  embedDisabled = false,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: PinterestEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth);
  const resolvedPlaceholder = resolveNativeEmbedPlaceholder({
    url: postUrl ?? url,
    linkText,
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
      html={pinterestEmbedHtml({ url: postUrl ?? url })}
      baseUrl="https://www.pinterest.com"
      width={resolvedMaxWidth}
      height={height}
      autoHeight
      fitDesignWidth={PINTEREST_DESIGN_WIDTH}
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
