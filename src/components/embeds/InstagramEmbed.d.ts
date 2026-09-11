import type { ReactElement } from 'react';
import type { InstagramEmbedProps } from './InstagramEmbed.types';

export {
  INSTAGRAM_CAPTIONED_PLACEHOLDER_HEIGHT,
  INSTAGRAM_PLACEHOLDER_HEIGHT,
  type InstagramEmbedProps,
} from './InstagramEmbed.types';

/** Platform implementations: `InstagramEmbed.web.tsx` / `InstagramEmbed.native.tsx`. */
export declare const InstagramEmbed: (props: InstagramEmbedProps) => ReactElement;
