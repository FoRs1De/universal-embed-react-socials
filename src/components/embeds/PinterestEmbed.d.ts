import type { ReactElement } from 'react';
import type { PinterestEmbedProps } from './PinterestEmbed.types';

export type { PinterestEmbedProps };

/** Platform implementations: `PinterestEmbed.web.tsx` / `PinterestEmbed.native.tsx`. */
export declare const PinterestEmbed: (props: PinterestEmbedProps) => ReactElement;
