import { useState } from 'react';
import { IFrame } from '../../host';
import { useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { resolveEmbedFrame, resolveEmbedMaxWidth } from '../../utils/style';
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
  width,
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
  embedPlaceholder,
  placeholderDisabled = false,
  className,
  style,
}: LinkedInEmbedProps) => {
  const [ready, setReady] = useState(false);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const { boxRef, scale, boxStyle } = useResponsiveEmbedBox(officialEmbedWidth, resolvedMaxWidth);
  const { frameHeight: shellHeight, showPlaceholder } = resolveEmbedFrame({
    ready,
    fallbackHeight: officialEmbedHeight,
    scale,
    height,
    waitForMeasure: false,
  });

  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url: postUrl ?? url,
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
          <IFrame
            className="linkedin-post"
            src={url}
            width={officialEmbedWidth}
            height={officialEmbedHeight}
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
