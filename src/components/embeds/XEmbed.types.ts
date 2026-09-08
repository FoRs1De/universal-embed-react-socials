import type { CommonEmbedProps } from '../../types';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';

export interface TwitterTweetEmbedProps {
  tweetId?: string;
  onLoad?: () => void;
}

export interface XEmbedProps extends CommonEmbedProps {
  placeholderProps?: PlaceholderEmbedProps;
  twitterTweetEmbedProps?: TwitterTweetEmbedProps;
}
