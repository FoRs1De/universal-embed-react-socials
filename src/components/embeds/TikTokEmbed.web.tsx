import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactElement } from 'react';
import { Box } from '../../host';
import { useAutoEmbedHeight, useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { useFrame } from '../../hooks/useFrame';
import { embedScaleStyle, resolveEmbedMaxWidth } from '../../utils/style';
import { Subs } from '../../utils/subs';
import { getTikTokVideoId } from '../../utils/urls';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import type { TikTokEmbedProps } from './TikTokEmbed.types';

export type { TikTokEmbedProps } from './TikTokEmbed.types';

const minPlaceholderWidth = 325;
const maxPlaceholderWidth = 480;
const defaultPlaceholderHeight = 550;
const officialEmbedWidth = 325;
const borderRadius = 8;

const PROCESS_EMBED_STAGE = 'process-embed';
const CONFIRM_EMBED_SUCCESS_STAGE = 'confirm-embed-success';
const RETRYING_STAGE = 'retrying';
const EMBED_SUCCESS_STAGE = 'embed-success';

export const TikTokEmbed = ({
  url,
  maxWidth,
  width,
  height,
  linkText = 'View post on TikTok',
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled = false,
  scriptLoadDisabled = false,
  retryDelay = 5000,
  retryDisabled = false,
  frame = undefined,
  debug = false,
  className,
  style,
}: TikTokEmbedProps): ReactElement => {
  const [stage, setStage] = useState(PROCESS_EMBED_STAGE);
  const placeholderId = useId();
  const [processTime, setProcessTime] = useState(0);
  const embedContainerKey = useMemo(() => `${placeholderId}-${processTime}`, [placeholderId, processTime]);
  const frm = useFrame(frame);
  const embedId = getTikTokVideoId(url);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const { boxRef, scale, boxStyle } = useResponsiveEmbedBox(officialEmbedWidth, resolvedMaxWidth);
  const { height: observedHeight, containerRef } = useAutoEmbedHeight({
    enabled: height == null,
  });

  useEffect(() => {
    debug && console.log(`[${new Date().toISOString()}]: ${stage}`);
  }, [debug, stage]);

  useEffect(() => {
    if (stage !== PROCESS_EMBED_STAGE || !frm.document || scriptLoadDisabled) {
      return;
    }
    const scriptId = 'tiktok-embed-script';
    const prevScript = frm.document.getElementById(scriptId);
    if (prevScript) {
      prevScript.remove();
    }
    const scriptElement = frm.document.createElement('script');
    scriptElement.setAttribute('src', `https://www.tiktok.com/embed.js?t=${Date.now()}`);
    scriptElement.setAttribute('id', scriptId);
    frm.document.head.appendChild(scriptElement);
    setStage(CONFIRM_EMBED_SUCCESS_STAGE);
  }, [scriptLoadDisabled, stage, frm.document]);

  useEffect(() => {
    const subs = new Subs();
    if (stage === CONFIRM_EMBED_SUCCESS_STAGE) {
      subs.setInterval(() => {
        if (frm.document && !frm.document.getElementById(placeholderId)) {
          setStage(EMBED_SUCCESS_STAGE);
        }
      }, 1);
      if (!retryDisabled) {
        subs.setTimeout(() => {
          setStage(RETRYING_STAGE);
        }, retryDelay);
      }
    }
    return subs.createCleanup();
  }, [placeholderId, retryDelay, retryDisabled, stage, frm.document]);

  useEffect(() => {
    if (stage === RETRYING_STAGE) {
      setProcessTime(Date.now());
      setStage(PROCESS_EMBED_STAGE);
    }
  }, [stage]);

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
    borderColor: 'rgba(22,24,35,0.12)',
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
    <div ref={boxRef} style={boxStyle}>
    <EmbedShell className={className} extraClassName="rsme-tiktok-embed" width="100%" height={height ?? Math.round((observedHeight ?? defaultPlaceholderHeight) * scale)} borderRadius={borderRadius} style={style}>
      <div ref={containerRef} style={embedScaleStyle(scale, officialEmbedWidth)}>
      <Box className="tiktok-embed-container">
        <blockquote key={embedContainerKey} className="tiktok-embed" cite={url} data-video-id={embedId}>
          {!placeholderDisabled ? (
            <div id={placeholderId} style={{ display: 'flex', justifyContent: 'center' }}>
              {placeholder}
            </div>
          ) : (
            <div id={placeholderId} style={{ display: 'none' }}>
              &nbsp;
            </div>
          )}
        </blockquote>
      </Box>
      </div>
    </EmbedShell>
    </div>
  );
};
