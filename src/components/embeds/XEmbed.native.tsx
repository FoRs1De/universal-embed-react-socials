import { getXPostId } from '../../utils/urls';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { xEmbedHtml } from './embedHtml';
import { NativeEmbedView } from './NativeEmbedView';
import type { XEmbedProps } from './XEmbed.types';

export type { TwitterTweetEmbedProps, XEmbedProps } from './XEmbed.types';

const defaultPlaceholderHeight = 350;

export const XEmbed = ({
  url,
  width,
  height,
  linkText = 'View post on X',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled,
  twitterTweetEmbedProps,
  style,
  webViewProps,
}: XEmbedProps) => {
  const postId = twitterTweetEmbedProps?.tweetId ?? getXPostId(url);
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={url}
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
      html={xEmbedHtml({ postId })}
      baseUrl="https://twitter.com"
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
