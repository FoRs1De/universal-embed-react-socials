import { useEffect, useState } from 'react';
import { IFrame } from '../../host';
import { useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { embedScaleStyle, resolveEmbedFrame, resolveEmbedMaxWidth } from '../../utils/style';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { EmbedShell } from './EmbedShell';
import { MediaFrame } from './MediaFrame';
import type { LinkedInEmbedProps } from './LinkedInEmbed.types';

export type { LinkedInEmbedProps } from './LinkedInEmbed.types';

const officialEmbedWidth = 504;
const officialEmbedHeight = 570;
const borderRadius = 8;

export const LinkedInEmbed = ({
  url,
  postUrl,
  maxWidth,
  height,
  linkText = 'View post on LinkedIn',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
  placeholderDisabled = false,
  embedDisabled = false,
  className,
  style,
}: LinkedInEmbedProps) => {
  const [ready, setReady] = useState(false);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth);

  useEffect(() => {
    if (embedDisabled) {
      setReady(false);
    }
  }, [embedDisabled]);
  const { boxRef, scale, boxStyle } = useResponsiveEmbedBox(officialEmbedWidth, resolvedMaxWidth);
  const { frameHeight: shellHeight, showPlaceholder } = resolveEmbedFrame({
    ready: !embedDisabled && ready,
    fallbackHeight: officialEmbedHeight,
    scale,
    height,
    waitForMeasure: false,
  });

  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url: postUrl ?? url,
    linkText,
    placeholder,
    placeholderDisabled,
    placeholderImageUrl,
    placeholderSpinner,
    placeholderSpinnerDisabled,
    placeholderProps,
    placeholderWidth,
    placeholderHeight,
    placeholderStyle,
    extraStyle: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0.15)',
      borderRadius,
    },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: officialEmbedWidth,
    providerHeight: officialEmbedHeight,
  });

  return (
    <div ref={boxRef} style={boxStyle}>
      <EmbedShell
        className={className}
        extraClassName="rsme-linkedin-embed"
        width="100%"
        height={shellHeight}
        borderRadius={borderRadius}
        style={style}
      >
        <MediaFrame showPlaceholder={showPlaceholder && !placeholderDisabled} placeholder={resolvedPlaceholder}>
          {embedDisabled ? null : (
          <IFrame
            className="linkedin-post"
            src={url}
            width={officialEmbedWidth}
            height={officialEmbedHeight}
            onLoad={() => setReady(true)}
            title="LinkedIn embed"
            style={embedScaleStyle(scale, officialEmbedWidth)}
          />
          )}
        </MediaFrame>
      </EmbedShell>
    </div>
  );
};
