import type { ReactElement } from 'react';
import type { PlaceholderEmbedProps } from './PlaceholderEmbed.types';

export type { PlaceholderEmbedProps };

/** Platform implementations: `PlaceholderEmbed.web.tsx` / `PlaceholderEmbed.native.tsx`. */
export declare const PlaceholderEmbed: (props: PlaceholderEmbedProps) => ReactElement;
