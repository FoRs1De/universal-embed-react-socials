import { resolveEmbedMaxWidth } from '../../utils/style';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import type { LinkedInEmbedProps } from './LinkedInEmbed.types';
import { NativeEmbedView } from './NativeEmbedView';

export type { LinkedInEmbedProps } from './LinkedInEmbed.types';

const officialEmbedWidth = 504;
const officialEmbedHeight = 570;

export const LinkedInEmbed = ({
  url,
  postUrl,
  maxWidth,
  width,
  height,
  linkText = 'View post on LinkedIn',
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
}: LinkedInEmbedProps) => {
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
      uri={url}
      width={resolvedMaxWidth}
      height={height}
      autoHeight={false}
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
