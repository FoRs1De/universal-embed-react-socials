import { getXPostId } from '../../utils/urls';
import { xEmbedHtml } from './embedHtml';
import { NativeSocialEmbed } from './NativeSocialEmbed';
import type { XEmbedProps } from './XEmbed.types';

export type { TwitterTweetEmbedProps, XEmbedProps } from './XEmbed.types';

const defaultPlaceholderHeight = 560;

export const XEmbed = ({
  twitterTweetEmbedProps,
  placeholderText = 'View post on X',
  ...props
}: XEmbedProps) => {
  const postId = twitterTweetEmbedProps?.tweetId ?? getXPostId(props.url);
  return (
    <NativeSocialEmbed
      {...props}
      placeholderText={placeholderText}
      html={xEmbedHtml({ postId })}
      baseUrl="https://twitter.com"
      fallbackHeight={defaultPlaceholderHeight}
    />
  );
};
