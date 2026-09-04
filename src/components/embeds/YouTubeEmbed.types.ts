import type { CommonEmbedProps } from '../../types';
import type { PlaceholderEmbedProps } from '../placeholder/PlaceholderEmbed.types';

export interface YouTubePlayerVars {
  start?: number;
  autoplay?: number;
  controls?: number;
  loop?: number;
  mute?: number;
  rel?: number;
  [key: string]: string | number | undefined;
}

export interface YouTubeProps {
  videoId?: string;
  className?: string;
  opts?: {
    width?: string | number;
    height?: string | number;
    playerVars?: YouTubePlayerVars;
    [key: string]: unknown;
  };
  onReady?: (event: { target: unknown }) => void;
  [key: string]: unknown;
}

export interface YouTubeEmbedProps extends CommonEmbedProps {
  placeholderProps?: PlaceholderEmbedProps;
  youTubeProps?: YouTubeProps;
}

export const buildYouTubeSrc = (
  videoId: string,
  playerVars: YouTubePlayerVars = {},
): string => {
  const params = new URLSearchParams();
  Object.entries(playerVars).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ''}`;
};
