import { useMemo } from 'react';
import { getYouTubeStart, getYouTubeVideoId } from '../../utils/urls';
import { NativeSocialEmbed } from './NativeSocialEmbed';
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
  youTubeProps,
  placeholderText = 'Watch on YouTube',
  height,
  ...props
}: YouTubeEmbedProps) => {
  const videoId = youTubeProps?.videoId ?? getYouTubeVideoId(props.url);
  const start = getYouTubeStart(props.url);
  const playerVars: YouTubePlayerVars = useMemo(
    () => ({
      playsinline: 1,
      rel: 0,
      origin: YOUTUBE_NATIVE_ORIGIN,
      ...(start ? { start } : {}),
      ...youTubeProps?.opts?.playerVars,
    }),
    [start, youTubeProps?.opts?.playerVars],
  );
  const html = useMemo(
    () => buildYouTubeEmbedHtml(buildYouTubeSrc(videoId, playerVars, YOUTUBE_NATIVE_ORIGIN)),
    [playerVars, videoId],
  );
  return (
    <NativeSocialEmbed
      {...props}
      placeholderText={placeholderText}
      html={html}
      baseUrl={YOUTUBE_NATIVE_ORIGIN}
      headers={youTubeHeaders}
      height={height ?? youTubeProps?.opts?.height}
      aspectRatio={16 / 9}
      fallbackHeight={defaultPlaceholderHeight}
      allowsInlineMediaPlayback
    />
  );
};
