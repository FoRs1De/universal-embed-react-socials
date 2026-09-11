import type { ReactElement } from 'react';
import type { XEmbedProps } from './XEmbed.types';

export type { TwitterTweetEmbedProps, XEmbedProps } from './XEmbed.types';

/** Platform implementations: `XEmbed.web.tsx` / `XEmbed.native.tsx`. */
export declare const XEmbed: (props: XEmbedProps) => ReactElement;
