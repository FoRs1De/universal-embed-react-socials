import type { CommonEmbedProps } from '../../types';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';
import type { NativeEmbedViewProps } from './NativeEmbedView.types';

export type NativeSocialEmbedProps = CommonEmbedProps &
  Omit<NativeEmbedViewProps, 'placeholder' | 'width' | 'embedDisabled'> & {
    placeholderUrl?: string;
    placeholderProps?: PlaceholderEmbedProps;
  };
