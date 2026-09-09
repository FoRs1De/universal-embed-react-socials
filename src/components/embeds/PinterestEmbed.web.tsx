import { useEffect, useId, useMemo, useState } from 'react';
import { IFrame } from '../../host';
import { embedMaxWidthStyle, isPercentage, resolveEmbedMaxWidth } from '../../utils/style';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { PINTEREST_DESIGN_WIDTH, pinterestEmbedHtml } from './embedHtml';
import { EmbedShell } from './EmbedShell';
import { MediaFrame } from './MediaFrame';
import type { PinterestEmbedProps } from './PinterestEmbed.types';

export type { PinterestEmbedProps } from './PinterestEmbed.types';

const officialEmbedHeight = 900;
const borderRadius = 16;

export const PinterestEmbed = ({
  url,
  postUrl,
  maxWidth,
  width,
  height,
  linkText = 'View post on Pinterest',
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
  embedDisabled = false,
  className,
  style,
}: PinterestEmbedProps) => {
  const embedId = useId();
  const postHref = postUrl ?? url;
  const embedHtml = useMemo(
    () => pinterestEmbedHtml({ url: postHref, fillWidth: true, embedId }),
    [embedId, postHref],
  );
  const [frameSrc, setFrameSrc] = useState<string | undefined>();
  const [pinHeight, setPinHeight] = useState(0);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const percentageHeight = isPercentage(height);

  useEffect(() => {
    if (embedDisabled) {
      setFrameSrc(undefined);
      setPinHeight(0);
      return;
    }
    const blob = new Blob([embedHtml], { type: 'text/html' });
    const next = URL.createObjectURL(blob);
    setFrameSrc(next);
    setPinHeight(0);
    return () => URL.revokeObjectURL(next);
  }, [embedHtml, embedDisabled]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { source?: string; id?: string; height?: number } | null;
      if (!data || data.source !== 'rsme-pinterest' || data.id !== embedId) {
        return;
      }
      if (typeof data.height === 'number' && data.height > 50) {
        setPinHeight((prev) => (Math.abs(prev - data.height!) < 2 ? prev : Math.round(data.height!)));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [embedId]);

  const frameHeight = typeof height === 'number' ? height : pinHeight;
  const ready = !embedDisabled && frameHeight > 0;
  const shellHeight = percentageHeight
    ? '100%'
    : frameHeight || (embedDisabled ? officialEmbedHeight : undefined);

  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url: postHref,
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
    providerWidth: resolvedMaxWidth,
    providerHeight: officialEmbedHeight,
  });

  return (
    <div style={{ ...embedMaxWidthStyle(resolvedMaxWidth), minWidth: 0 }}>
      <EmbedShell
        className={className}
        extraClassName="rsme-pinterest-embed"
        width="100%"
        height={shellHeight}
        borderRadius={borderRadius}
        style={style}
      >
        <MediaFrame showPlaceholder={!ready && !placeholderDisabled} placeholder={resolvedPlaceholder}>
          {embedDisabled || !frameSrc ? null : (
            <IFrame
              src={frameSrc}
              width="100%"
              height={frameHeight || officialEmbedHeight}
              title="Pinterest embed"
              style={{
                width: '100%',
                height: frameHeight || officialEmbedHeight,
                overflow: 'hidden',
              }}
            />
          )}
        </MediaFrame>
      </EmbedShell>
    </div>
  );
};
