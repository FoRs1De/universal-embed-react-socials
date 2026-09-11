import type { ReactElement } from 'react';
import type { LinkedInEmbedProps } from './LinkedInEmbed.types';

export type { LinkedInEmbedProps };

/** Platform implementations: `LinkedInEmbed.web.tsx` / `LinkedInEmbed.native.tsx`. */
export declare const LinkedInEmbed: (props: LinkedInEmbedProps) => ReactElement;
