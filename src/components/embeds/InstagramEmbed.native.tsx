import { DEFAULT_INSTAGRAM_API_VERSION, normalizeInstagramApiVersion } from '../../utils/apiVersion';
import { getCleanInstagramUrl } from '../../utils/urls';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { instagramEmbedHtml } from './embedHtml';
import type { InstagramEmbedProps } from './InstagramEmbed.types';
import { NativeEmbedView } from './NativeEmbedView';

export type { InstagramEmbedProps } from './InstagramEmbed.types';

const defaultPlaceholderHeight = 372;

export const InstagramEmbed = ({
  url,
  width,
  height,
  linkText = 'View post on Instagram',
  captioned = false,
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled = false,
  igVersion = DEFAULT_INSTAGRAM_API_VERSION,
  apiVersion,
  style,
  webViewProps,
}: InstagramEmbedProps) => {
  const resolvedVersion = normalizeInstagramApiVersion(apiVersion ?? igVersion);
  const cleanUrlWithEndingSlash = getCleanInstagramUrl(url);
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={cleanUrlWithEndingSlash}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      {...placeholderProps}
      style={{
        width: width ?? '100%',
        height: height ?? defaultPlaceholderHeight,
        ...placeholderProps?.style,
      }}
    />
  );

  return (
    <NativeEmbedView
      html={instagramEmbedHtml({
        url: cleanUrlWithEndingSlash,
        apiVersion: resolvedVersion,
        captioned,
      })}
      baseUrl="https://www.instagram.com"
      width={width}
      height={height}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={placeholder}
      placeholderDisabled={placeholderDisabled}
      webViewProps={webViewProps}
    />
  );
};
