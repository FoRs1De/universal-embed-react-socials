import { resolveEmbedMaxWidth } from '../../utils/style';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import type { LinkedInEmbedProps } from './LinkedInEmbed.types';
import { NativeEmbedView } from './NativeEmbedView';

export type { LinkedInEmbedProps } from './LinkedInEmbed.types';

const defaultPlaceholderHeight = 550;

export const LinkedInEmbed = ({
  url,
  postUrl,
  maxWidth,
  width,
  height = 500,
  linkText = 'View post on LinkedIn',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled = false,
  style,
  webViewProps,
}: LinkedInEmbedProps) => {
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={postUrl ?? url}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      {...placeholderProps}
      style={{
        width: resolvedMaxWidth ?? '100%',
        height: height ?? defaultPlaceholderHeight,
        ...placeholderProps?.style,
      }}
    />
  );

  return (
    <NativeEmbedView
      uri={url}
      width={resolvedMaxWidth}
      height={height}
      style={style}
      fallbackHeight={defaultPlaceholderHeight}
      placeholder={placeholder}
      placeholderDisabled={placeholderDisabled}
      webViewProps={webViewProps}
    />
  );
};
