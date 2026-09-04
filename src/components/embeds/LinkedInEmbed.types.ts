import type { CommonEmbedProps } from '../../types';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';

export interface LinkedInEmbedProps extends CommonEmbedProps {
  postUrl?: string;
  placeholderProps?: PlaceholderEmbedProps;
}
