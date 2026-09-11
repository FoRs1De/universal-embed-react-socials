import { DEFAULT_INSTAGRAM_API_VERSION, normalizeInstagramApiVersion } from '../../utils/apiVersion';
import { getCleanInstagramUrl } from '../../utils/urls';
import { instagramEmbedHtml } from './embedHtml';
import {
  INSTAGRAM_CAPTIONED_PLACEHOLDER_HEIGHT,
  INSTAGRAM_PLACEHOLDER_HEIGHT,
  type InstagramEmbedProps,
} from './InstagramEmbed.types';
import { NativeSocialEmbed } from './NativeSocialEmbed';

export type { InstagramEmbedProps } from './InstagramEmbed.types';
export {
  INSTAGRAM_CAPTIONED_PLACEHOLDER_HEIGHT,
  INSTAGRAM_PLACEHOLDER_HEIGHT,
} from './InstagramEmbed.types';

export const InstagramEmbed = ({
  captioned = false,
  apiVersion = DEFAULT_INSTAGRAM_API_VERSION,
  placeholderText = 'View post on Instagram',
  ...props
}: InstagramEmbedProps) => {
  const resolvedVersion = normalizeInstagramApiVersion(apiVersion);
  const cleanUrl = getCleanInstagramUrl(props.url);
  return (
    <NativeSocialEmbed
      {...props}
      url={cleanUrl}
      placeholderText={placeholderText}
      placeholderUrl={cleanUrl}
      html={instagramEmbedHtml({ url: cleanUrl, apiVersion: resolvedVersion, captioned })}
      baseUrl="https://www.instagram.com"
      fallbackHeight={captioned ? INSTAGRAM_CAPTIONED_PLACEHOLDER_HEIGHT : INSTAGRAM_PLACEHOLDER_HEIGHT}
    />
  );
};
