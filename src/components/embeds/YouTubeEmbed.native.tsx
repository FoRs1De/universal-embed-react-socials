import { resolveEmbedMaxWidth } from '../../utils/style';
import { getYouTubeStart, getYouTubeVideoId } from '../../utils/urls';
import { resolveNativeEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { NativeEmbedView } from './NativeEmbedView';
import {
  YOUTUBE_NATIVE_ORIGIN,
  buildYouTubeEmbedHtml,
  buildYouTubeSrc,
  type YouTubeEmbedProps,
  type YouTubePlayerVars,
} from './YouTubeEmbed.types';

export type { YouTubeEmbedProps, YouTubePlayerVars, YouTubeProps } from './YouTubeEmbed.types';

const defaultPlaceholderHeight = 360;
const youTubeHeaders = { Referer: `${YOUTUBE_NATIVE_ORIGIN}/` };

export const YouTubeEmbed = ({
  url,
  maxWidth,
  height,
  placeholderText = 'Watch on YouTube',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  placeholderDisabled,
  embedDisabled = false,
  youTubeProps,
  style,
  webViewProps,
  openLinksInBrowser = true,
}: YouTubeEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth);
  const videoId = youTubeProps?.videoId ?? getYouTubeVideoId(url);
  const start = getYouTubeStart(url);
  const playerVars: YouTubePlayerVars = {
    playsinline: 1,
    rel: 0,
    origin: YOUTUBE_NATIVE_ORIGIN,
    ...(start ? { start } : {}),
    ...youTubeProps?.opts?.playerVars,
  };
  const resolvedPlaceholder = resolveNativeEmbedPlaceholder({
    url,
    placeholderText,
    placeholder,
    placeholderDisabled,
    placeholderImageUrl,
    placeholderSpinner,
    placeholderSpinnerDisabled,
    placeholderProps,
    placeholderWidth,
    placeholderHeight,
    placeholderStyle,
    resolvedMaxWidth,
    height,
    fallbackHeight: defaultPlaceholderHeight,
  });

  return (
    <NativeEmbedView
      html={buildYouTubeEmbedHtml(buildYouTubeSrc(videoId, playerVars, YOUTUBE_NATIVE_ORIGIN))}
      baseUrl={YOUTUBE_NATIVE_ORIGIN}
      headers={youTubeHeaders}
      width={resolvedMaxWidth}
      height={height ?? youTubeProps?.opts?.height}
      aspectRatio={16 / 9}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={resolvedPlaceholder}
      placeholderDisabled={placeholderDisabled}
      embedDisabled={embedDisabled}
      allowsInlineMediaPlayback
      openLinksInBrowser={openLinksInBrowser}
      webViewProps={webViewProps}
    />
  );
};
