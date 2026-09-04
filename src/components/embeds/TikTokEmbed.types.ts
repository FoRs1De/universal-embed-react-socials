import type { CommonEmbedProps } from '../../types';
import type { Frame } from '../../hooks/useFrame';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';

export interface TikTokEmbedProps extends CommonEmbedProps {
  placeholderProps?: PlaceholderEmbedProps;
  scriptLoadDisabled?: boolean;
  retryDelay?: number;
  retryDisabled?: boolean;
  frame?: Frame;
  debug?: boolean;
}
