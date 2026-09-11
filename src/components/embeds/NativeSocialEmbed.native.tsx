import { resolveEmbedMaxWidth } from '../../utils/style';
import type { CommonEmbedProps } from '../../types';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';
import {
  embedPlaceholderFields,
  resolveNativeEmbedPlaceholder,
} from '../placeholder/resolveEmbedPlaceholder';
import { NativeEmbedView } from './NativeEmbedView';
import type { NativeEmbedViewProps } from './NativeEmbedView.types';

export type NativeSocialEmbedProps = CommonEmbedProps &
  Omit<NativeEmbedViewProps, 'placeholder' | 'width' | 'embedDisabled'> & {
    fallbackHeight: number;
    placeholderUrl?: string;
    placeholderProps?: PlaceholderEmbedProps;
  };

export const NativeSocialEmbed = ({
  url,
  maxWidth,
  height,
  placeholderText,
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled,
  placeholderProps,
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  placeholderDisabled,
  embedDisabled,
  lazy,
  style,
  webViewProps,
  openLinksInBrowser = true,
  fallbackHeight,
  placeholderUrl,
  html,
  uri,
  baseUrl,
  headers,
  aspectRatio,
  autoHeight,
  fitDesignWidth,
  allowsInlineMediaPlayback,
  mediaPlaybackRequiresUserAction,
  allowsFullscreenVideo,
  resolveExternalUrl,
}: NativeSocialEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth);
  const resolvedPlaceholder = resolveNativeEmbedPlaceholder({
    ...embedPlaceholderFields({
      placeholderText,
      placeholderImageUrl,
      placeholderSpinner,
      placeholderSpinnerDisabled,
      placeholderProps,
      placeholder,
      placeholderWidth,
      placeholderHeight,
      placeholderStyle,
      placeholderDisabled,
    }),
    url: placeholderUrl ?? url,
    resolvedMaxWidth,
    height,
    fallbackHeight,
  });

  return (
    <NativeEmbedView
      html={html}
      uri={uri}
      baseUrl={baseUrl}
      headers={headers}
      aspectRatio={aspectRatio}
      autoHeight={autoHeight}
      fitDesignWidth={fitDesignWidth}
      allowsInlineMediaPlayback={allowsInlineMediaPlayback}
      mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
      allowsFullscreenVideo={allowsFullscreenVideo}
      resolveExternalUrl={resolveExternalUrl}
      width={resolvedMaxWidth}
      height={height}
      style={style}
      fallbackHeight={fallbackHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      embedDisabled={embedDisabled}
      lazy={lazy}
      openLinksInBrowser={openLinksInBrowser}
      webViewProps={webViewProps}
    />
  );
};
