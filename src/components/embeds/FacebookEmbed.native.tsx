import { DEFAULT_FACEBOOK_API_VERSION, DEFAULT_FACEBOOK_LOCALE } from '../../utils/apiVersion';
import { isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { facebookEmbedHtml } from './embedHtml';
import type { FacebookEmbedProps } from './FacebookEmbed.types';
import { NativeSocialEmbed } from './NativeSocialEmbed';

export type { FacebookEmbedProps } from './FacebookEmbed.types';

const defaultPlaceholderHeight = 372;

export const FacebookEmbed = ({
  apiVersion = DEFAULT_FACEBOOK_API_VERSION,
  locale = DEFAULT_FACEBOOK_LOCALE,
  placeholderText = 'View post on Facebook',
  ...props
}: FacebookEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(props.maxWidth);
  const resolvedWidth = isPercentage(resolvedMaxWidth) ? '100%' : resolvedMaxWidth;
  return (
    <NativeSocialEmbed
      {...props}
      placeholderText={placeholderText}
      html={facebookEmbedHtml({ url: props.url, width: resolvedWidth, apiVersion, locale })}
      baseUrl="https://www.facebook.com"
      fallbackHeight={defaultPlaceholderHeight}
    />
  );
};
