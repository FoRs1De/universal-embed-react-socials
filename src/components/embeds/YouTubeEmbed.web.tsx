import { useState, type CSSProperties } from 'react';
import { Box, IFrame } from '../../host';
import { classNames } from '../../utils/classNames';
import { isPercentage } from '../../utils/style';
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
  const percentageWidth = isPercentage(width);
  const percentageHeight = isPercentage(height);

  const playerVars: YouTubePlayerVars = {
    ...(start ? { start } : {}),
    ...youTubeProps?.opts?.playerVars,
  };
  const src = buildYouTubeSrc(videoId, playerVars);
  const embedWidth = youTubeProps?.opts?.width ?? (percentageWidth ? '100%' : width);
  const embedHeight = youTubeProps?.opts?.height ?? (percentageHeight ? '100%' : height);

  const placeholderStyle: CSSProperties = {
    maxWidth: percentageWidth ? undefined : maxPlaceholderWidth,
    width: typeof width !== 'undefined' ? (percentageWidth ? '100%' : width) : '100%',
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
    <EmbedShell className={className} extraClassName="rsme-youtube-embed" width={width} height={height} borderRadius={borderRadius} style={style}>
      <MediaFrame showPlaceholder={!ready && !placeholderDisabled} placeholder={placeholder}>
        <Box className={classNames(!ready && 'rsme-d-none')}>
          <IFrame
            className={youTubeProps?.className ?? 'youtube-iframe'}
            src={src}
            width={embedWidth ?? '100%'}
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
  );
};
