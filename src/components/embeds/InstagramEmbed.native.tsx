import { DEFAULT_INSTAGRAM_API_VERSION, normalizeInstagramApiVersion } from '../../utils/apiVersion';
import { resolveEmbedMaxWidth } from '../../utils/style';
import { getCleanInstagramUrl } from '../../utils/urls';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { instagramEmbedHtml } from './embedHtml';
import type { InstagramEmbedProps } from './InstagramEmbed.types';
import { NativeEmbedView } from './NativeEmbedView';

export type { InstagramEmbedProps } from './InstagramEmbed.types';

const defaultPlaceholderHeight = 560;
const captionedPlaceholderHeight = 640;

export const InstagramEmbed = ({
  url,
  maxWidth,
  width,
  height,
  linkText = 'View post on Instagram',
  captioned = false,
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
  igVersion = DEFAULT_INSTAGRAM_API_VERSION,
  apiVersion,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: InstagramEmbedProps) => {
  const resolvedVersion = normalizeInstagramApiVersion(apiVersion ?? igVersion);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const cleanUrlWithEndingSlash = getCleanInstagramUrl(url);
  const fallbackHeight = captioned ? captionedPlaceholderHeight : defaultPlaceholderHeight;
  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url: cleanUrlWithEndingSlash,
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
    providerHeight: height ?? fallbackHeight,
  });

  return (
    <NativeEmbedView
      html={instagramEmbedHtml({
        url: cleanUrlWithEndingSlash,
        apiVersion: resolvedVersion,
        captioned,
      })}
      baseUrl="https://www.instagram.com"
      width={resolvedMaxWidth}
      height={height}
      style={style}
      fallbackHeight={fallbackHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      openLinksInBrowser={openLinksInBrowser}
      webViewProps={webViewProps}
    />
  );
};
