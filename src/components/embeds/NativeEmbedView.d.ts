import type { ReactElement } from 'react';
import type { NativeEmbedViewProps } from './NativeEmbedView.types';

export type { NativeEmbedViewProps };

/** Native implementation lives in `NativeEmbedView.native.tsx`. Metro resolves that file. */
export declare const NativeEmbedView: (props: NativeEmbedViewProps) => ReactElement;
