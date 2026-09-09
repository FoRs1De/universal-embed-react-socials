import { resolveEmbedMaxWidth } from '../../utils/style';
import { getXPostId } from '../../utils/urls';
import { resolveNativeEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { xEmbedHtml } from './embedHtml';
import { NativeEmbedView } from './NativeEmbedView';
import type { XEmbedProps } from './XEmbed.types';

export type { TwitterTweetEmbedProps, XEmbedProps } from './XEmbed.types';

const defaultPlaceholderHeight = 560;

export const XEmbed = ({
  url,
  maxWidth,
  width,
  height,
  linkText = 'View post on X',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  embedPlaceholder,
  placeholderDisabled,
  embedDisabled = false,
  twitterTweetEmbedProps,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: XEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const postId = twitterTweetEmbedProps?.tweetId ?? getXPostId(url);
  const resolvedPlaceholder = resolveNativeEmbedPlaceholder({
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
    resolvedMaxWidth,
    height,
    fallbackHeight: defaultPlaceholderHeight,
  });

  return (
    <NativeEmbedView
      html={xEmbedHtml({ postId })}
      baseUrl="https://twitter.com"
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
