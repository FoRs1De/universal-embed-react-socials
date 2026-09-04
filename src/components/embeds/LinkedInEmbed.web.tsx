import { useState, type CSSProperties } from 'react';
import { IFrame } from '../../host';
import { classNames } from '../../utils/classNames';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import { MediaFrame } from './MediaFrame';
import type { LinkedInEmbedProps } from './LinkedInEmbed.types';

export type { LinkedInEmbedProps } from './LinkedInEmbed.types';

const minPlaceholderWidth = 250;
const maxPlaceholderWidth = 550;
const defaultPlaceholderHeight = 550;
const borderRadius = 8;

export const LinkedInEmbed = ({
  url,
  postUrl,
  width,
  height = 500,
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

  const placeholderStyle: CSSProperties = {
    minWidth: minPlaceholderWidth,
    maxWidth: maxPlaceholderWidth,
    width: typeof width !== 'undefined' ? width : '100%',
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
    <EmbedShell className={className} extraClassName="rsme-linkedin-embed" width={width} height={height} borderRadius={borderRadius} style={style}>
      <MediaFrame showPlaceholder={!ready && !placeholderDisabled} placeholder={placeholder}>
        <IFrame
          className={classNames('linkedin-post', !ready && 'rsme-d-none')}
          src={url}
          width="100%"
          height={!ready ? 0 : height}
          frameBorder={0}
          onLoad={() => setReady(true)}
          title="LinkedIn embed"
        />
      </MediaFrame>
    </EmbedShell>
  );
};
