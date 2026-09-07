import { DEFAULT_FACEBOOK_API_VERSION, DEFAULT_FACEBOOK_LOCALE } from '../../utils/apiVersion';
import { isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { facebookEmbedHtml } from './embedHtml';
import type { FacebookEmbedProps } from './FacebookEmbed.types';
import { NativeEmbedView } from './NativeEmbedView';

export type { FacebookEmbedProps } from './FacebookEmbed.types';

const defaultEmbedWidth = 550;
const defaultPlaceholderHeight = 372;

export const FacebookEmbed = ({
  url,
  maxWidth,
  width,
  height,
  linkText = 'View post on Facebook',
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
  apiVersion = DEFAULT_FACEBOOK_API_VERSION,
  locale = DEFAULT_FACEBOOK_LOCALE,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: FacebookEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const resolvedWidth = isPercentage(resolvedMaxWidth)
    ? '100%'
    : (resolvedMaxWidth ?? defaultEmbedWidth);
  const resolvedPlaceholder = resolveEmbedPlaceholder({
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
    extraStyle: { width: resolvedMaxWidth ?? '100%' },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: resolvedMaxWidth ?? '100%',
    providerHeight: height ?? defaultPlaceholderHeight,
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
      openLinksInBrowser={openLinksInBrowser}
      webViewProps={webViewProps}
    />
  );
};
