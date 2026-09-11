import type { ReactElement } from 'react';
import type { FacebookEmbedProps } from './FacebookEmbed.types';

export type { FacebookEmbedProps };

/** Platform implementations: `FacebookEmbed.web.tsx` / `FacebookEmbed.native.tsx`. */
export declare const FacebookEmbed: (props: FacebookEmbedProps) => ReactElement;
