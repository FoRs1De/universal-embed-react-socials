import { DEFAULT_FACEBOOK_API_VERSION, DEFAULT_FACEBOOK_LOCALE } from '../../utils/apiVersion';
import { isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { resolveNativeEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { facebookEmbedHtml } from './embedHtml';
import type { FacebookEmbedProps } from './FacebookEmbed.types';
import { NativeEmbedView } from './NativeEmbedView';

export type { FacebookEmbedProps } from './FacebookEmbed.types';

const defaultPlaceholderHeight = 372;

export const FacebookEmbed = ({
  url,
  maxWidth,
  height,
  placeholderText = 'View post on Facebook',
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
  apiVersion = DEFAULT_FACEBOOK_API_VERSION,
  locale = DEFAULT_FACEBOOK_LOCALE,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: FacebookEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth);
  const resolvedWidth = isPercentage(resolvedMaxWidth)
    ? '100%'
    : resolvedMaxWidth;
  const resolvedPlaceholder = resolveNativeEmbedPlaceholder({
    url,
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
    fallbackHeight: defaultPlaceholderHeight,
  });

  return (
    <NativeEmbedView
      html={facebookEmbedHtml({ url, width: resolvedWidth, apiVersion, locale })}
      baseUrl="https://www.facebook.com"
      width={resolvedMaxWidth}
      height={height}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      embedDisabled={embedDisabled}
      openLinksInBrowser={openLinksInBrowser}
      webViewProps={webViewProps}
    />
  );
};
