import { resolveEmbedMaxWidth } from '../../utils/style';
import { getYouTubeStart, getYouTubeVideoId } from '../../utils/urls';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { NativeEmbedView } from './NativeEmbedView';
import { buildYouTubeSrc, type YouTubeEmbedProps, type YouTubePlayerVars } from './YouTubeEmbed.types';

export type { YouTubeEmbedProps, YouTubePlayerVars, YouTubeProps } from './YouTubeEmbed.types';

const defaultPlaceholderHeight = 360;

export const YouTubeEmbed = ({
  url,
  maxWidth,
  width,
  height,
  linkText = 'Watch on YouTube',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  embedPlaceholder,
  placeholderDisabled,
  youTubeProps,
  style,
  webViewProps,
}: YouTubeEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const videoId = youTubeProps?.videoId ?? getYouTubeVideoId(url);
  const start = getYouTubeStart(url);
  const playerVars: YouTubePlayerVars = {
    ...(start ? { start } : {}),
    ...youTubeProps?.opts?.playerVars,
  };
  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url,
    linkText,
    placeholder,
    embedPlaceholder,
    placeholderDisabled,
    placeholderImageUrl,
    placeholderSpinner,
    placeholderSpinnerDisabled,
    placeholderProps,
    placeholderWidth,
    placeholderHeight,
    placeholderStyle,
    extraStyle: { width: resolvedMaxWidth ?? '100%' },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: resolvedMaxWidth ?? '100%',
    providerHeight: height ?? defaultPlaceholderHeight,
  });

  return (
    <NativeEmbedView
      uri={buildYouTubeSrc(videoId, playerVars)}
      width={resolvedMaxWidth}
      height={height ?? youTubeProps?.opts?.height}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      webViewProps={webViewProps}
    />
  );
};
