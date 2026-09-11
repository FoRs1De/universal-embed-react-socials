import type { ReactElement } from 'react';
import type { YouTubeEmbedProps } from './YouTubeEmbed.types';

export type {
  YouTubeEmbedProps,
  YouTubePlayerVars,
  YouTubeProps,
} from './YouTubeEmbed.types';

/** Platform implementations: `YouTubeEmbed.web.tsx` / `YouTubeEmbed.native.tsx`. */
export declare const YouTubeEmbed: (props: YouTubeEmbedProps) => ReactElement;
