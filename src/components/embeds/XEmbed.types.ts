import type { ReactNode } from 'react';
import type { CommonEmbedProps } from '../../types';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';

export interface TwitterTweetEmbedProps {
  tweetId?: string;
  options?: Record<string, unknown>;
  onLoad?: () => void;
  placeholder?: ReactNode;
  [key: string]: unknown;
}

export interface XEmbedProps extends CommonEmbedProps {
  placeholderProps?: PlaceholderEmbedProps;
  twitterTweetEmbedProps?: TwitterTweetEmbedProps;
}
