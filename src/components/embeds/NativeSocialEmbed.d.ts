import type { ReactElement } from 'react';
import type { NativeSocialEmbedProps } from './NativeSocialEmbed.types';

export type { NativeSocialEmbedProps };

/** Native implementation lives in `NativeSocialEmbed.native.tsx`. Metro resolves that file. */
export declare const NativeSocialEmbed: (props: NativeSocialEmbedProps) => ReactElement;
