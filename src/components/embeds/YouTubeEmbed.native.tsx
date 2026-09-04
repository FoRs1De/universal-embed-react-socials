import { getYouTubeStart, getYouTubeVideoId } from '../../utils/urls';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { NativeEmbedView } from './NativeEmbedView';
import { buildYouTubeSrc, type YouTubeEmbedProps, type YouTubePlayerVars } from './YouTubeEmbed.types';

export type { YouTubeEmbedProps, YouTubePlayerVars, YouTubeProps } from './YouTubeEmbed.types';

const defaultPlaceholderHeight = 360;

export const YouTubeEmbed = ({
  url,
  width,
  height,
  linkText = 'Watch on YouTube',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled,
  youTubeProps,
  style,
  webViewProps,
}: YouTubeEmbedProps) => {
  const videoId = youTubeProps?.videoId ?? getYouTubeVideoId(url);
  const start = getYouTubeStart(url);
  const playerVars: YouTubePlayerVars = {
    ...(start ? { start } : {}),
    ...youTubeProps?.opts?.playerVars,
  };
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={url}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      {...placeholderProps}
      style={{
        width: width ?? '100%',
        height: height ?? defaultPlaceholderHeight,
        ...placeholderProps?.style,
      }}
    />
  );

  return (
    <NativeEmbedView
      uri={buildYouTubeSrc(videoId, playerVars)}
      width={width}
      height={height ?? youTubeProps?.opts?.height}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={placeholder}
      placeholderDisabled={placeholderDisabled}
      webViewProps={webViewProps}
    />
  );
};
