import type { ReactElement } from 'react';
import type { TikTokEmbedProps } from './TikTokEmbed.types';

export type {
  TikTokEmbedProps,
  TikTokPlayerFlag,
  TikTokPlayerVars,
} from './TikTokEmbed.types';

/** Platform implementations: `TikTokEmbed.web.tsx` / `TikTokEmbed.native.tsx`. */
export declare const TikTokEmbed: (props: TikTokEmbedProps) => ReactElement;
