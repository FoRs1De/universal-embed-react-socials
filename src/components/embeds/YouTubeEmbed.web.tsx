import { useState, type CSSProperties } from 'react';
import { Box, IFrame } from '../../host';
import { useAutoEmbedHeight } from '../../hooks/useEmbedHeight';
import { classNames } from '../../utils/classNames';
import { embedMaxWidthStyle, isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { getYouTubeStart, getYouTubeVideoId } from '../../utils/urls';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import { MediaFrame } from './MediaFrame';
import { buildYouTubeSrc, type YouTubeEmbedProps, type YouTubePlayerVars } from './YouTubeEmbed.types';

export type { YouTubeEmbedProps, YouTubePlayerVars, YouTubeProps } from './YouTubeEmbed.types';

const maxPlaceholderWidth = 640;
const defaultPlaceholderHeight = 360;
const borderRadius = 0;

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
  embedPlaceholder,
  placeholderDisabled,
  youTubeProps,
  className,
  style,
}: YouTubeEmbedProps) => {
  const [ready, setReady] = useState(false);
  const videoId = youTubeProps?.videoId ?? getYouTubeVideoId(url);
  const start = getYouTubeStart(url);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const percentageWidth = isPercentage(resolvedMaxWidth);
  const percentageHeight = isPercentage(height);
  const autoHeight = height == null && youTubeProps?.opts?.height == null && !percentageHeight;
  const { height: resolvedHeight, containerRef } = useAutoEmbedHeight({
    enabled: autoHeight,
    fallback: defaultPlaceholderHeight,
    aspectRatio: 16 / 9,
  });

  const playerVars: YouTubePlayerVars = {
    ...(start ? { start } : {}),
    ...youTubeProps?.opts?.playerVars,
  };
  const src = buildYouTubeSrc(videoId, playerVars);
  const embedHeight = youTubeProps?.opts?.height ?? (percentageHeight ? '100%' : (height ?? resolvedHeight));

  const placeholderStyle: CSSProperties = {
    maxWidth: percentageWidth ? undefined : maxPlaceholderWidth,
    width: '100%',
    height: percentageHeight
      ? '100%'
      : typeof height !== 'undefined'
        ? height
        : typeof style?.height !== 'undefined' || typeof style?.maxHeight !== 'undefined'
          ? '100%'
          : defaultPlaceholderHeight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dee2e6',
    borderRadius,
  };
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={url}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      {...placeholderProps}
      style={{ ...placeholderStyle, ...placeholderProps?.style }}
    />
  );

  return (
    <div ref={containerRef} style={embedMaxWidthStyle(resolvedMaxWidth)}>
    <EmbedShell className={className} extraClassName="rsme-youtube-embed" width="100%" height={height ?? embedHeight} borderRadius={borderRadius} style={style}>
      <MediaFrame showPlaceholder={!ready && !placeholderDisabled} placeholder={placeholder}>
        <Box className={classNames(!ready && 'rsme-d-none')}>
          <IFrame
            className={youTubeProps?.className ?? 'youtube-iframe'}
            src={src}
            width="100%"
            height={embedHeight ?? '100%'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="YouTube embed"
            onLoad={() => {
              setReady(true);
              youTubeProps?.onReady?.({ target: undefined });
            }}
          />
        </Box>
      </MediaFrame>
    </EmbedShell>
    </div>
  );
};
