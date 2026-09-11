import type { CommonEmbedProps } from '../../types';
import type { Frame } from '../../hooks/useFrame';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';

export interface InstagramEmbedProps extends CommonEmbedProps {
  captioned?: boolean;
  placeholderProps?: PlaceholderEmbedProps;
  scriptLoadDisabled?: boolean;
  retryDelay?: number;
  retryDisabled?: boolean;
  /** Instagram embed.js `data-instgrm-version`. Current official embed markup uses `"14"`. */
  apiVersion?: string;
  frame?: Frame;
  debug?: boolean;
}
