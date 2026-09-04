import { useState, type CSSProperties } from 'react';
import { IFrame } from '../../host';
import { useAutoEmbedHeight, useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import { MediaFrame } from './MediaFrame';
import type { LinkedInEmbedProps } from './LinkedInEmbed.types';

export type { LinkedInEmbedProps } from './LinkedInEmbed.types';

const minPlaceholderWidth = 250;
const maxPlaceholderWidth = 550;
const defaultPlaceholderHeight = 550;
const officialEmbedWidth = 504;
const officialEmbedHeight = 570;
const borderRadius = 8;
const LINKEDIN_ORIGINS = ['linkedin.com', 'linkedin.cn', 'licdn.com'];

export const LinkedInEmbed = ({
  url,
  postUrl,
  maxWidth,
  width,
  height,
  linkText = 'View post on LinkedIn',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled = false,
  className,
  style,
}: LinkedInEmbedProps) => {
  const [ready, setReady] = useState(false);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const { boxRef, scale, boxStyle } = useResponsiveEmbedBox(officialEmbedWidth, resolvedMaxWidth);
  const autoHeight = height == null;
  const { iframeRef } = useAutoEmbedHeight({
    enabled: autoHeight,
    fallback: officialEmbedHeight,
    listenToMessages: autoHeight,
    allowedOrigins: LINKEDIN_ORIGINS,
  });
  const frameHeight = Math.round(officialEmbedHeight * scale);

  const placeholderStyle: CSSProperties = {
    minWidth: minPlaceholderWidth,
    maxWidth: maxPlaceholderWidth,
    width: '100%',
    height:
      typeof height !== 'undefined'
        ? height
        : typeof style?.height !== 'undefined' || typeof style?.maxHeight !== 'undefined'
          ? '100%'
          : defaultPlaceholderHeight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius,
  };
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={postUrl ?? url}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      {...placeholderProps}
      style={{ ...placeholderStyle, ...placeholderProps?.style }}
    />
  );

  return (
    <div ref={boxRef} style={boxStyle}>
      <EmbedShell
        className={className}
        extraClassName="rsme-linkedin-embed"
        width="100%"
        height={typeof height === 'number' && !isPercentage(height) ? height : frameHeight}
        borderRadius={borderRadius}
        style={style}
      >
        <MediaFrame showPlaceholder={!ready && !placeholderDisabled} placeholder={placeholder}>
          <IFrame
            iframeRef={iframeRef}
            className="linkedin-post"
            src={url}
            width={officialEmbedWidth}
            height={officialEmbedHeight}
            frameBorder={0}
            scrolling="no"
            onLoad={() => setReady(true)}
            title="LinkedIn embed"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </MediaFrame>
      </EmbedShell>
    </div>
  );
};
