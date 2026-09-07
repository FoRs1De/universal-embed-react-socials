import { useEffect, useId, useMemo, useState, type ReactElement } from 'react';
import { Box } from '../../host';
import { useAutoEmbedHeight, useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { useFrame } from '../../hooks/useFrame';
import { embedScaleStyle, placeholderOverlayStyle, resolveEmbedFrame, resolveEmbedMaxWidth } from '../../utils/style';
import { Subs } from '../../utils/subs';
import { getTikTokVideoId } from '../../utils/urls';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { EmbedShell } from './EmbedShell';
import type { TikTokEmbedProps } from './TikTokEmbed.types';

export type { TikTokEmbedProps } from './TikTokEmbed.types';

const minPlaceholderWidth = 325;
const maxPlaceholderWidth = 480;
const defaultPlaceholderHeight = 739;
const officialEmbedWidth = 325;
const tiktokContentMinHeight = 500;
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
  placeholder,
  placeholderWidth,
  placeholderHeight,
  placeholderStyle,
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
        if (frm.document?.querySelector('.tiktok-embed-container iframe')) {
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

  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url,
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
      borderColor: 'rgba(22,24,35,0.12)',
      borderRadius,
    },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: officialEmbedWidth,
    providerHeight: defaultPlaceholderHeight,
  });
  const embedReady = stage === EMBED_SUCCESS_STAGE;
  const videoHeight =
    observedHeight != null && observedHeight >= tiktokContentMinHeight ? observedHeight : undefined;
  const { frameHeight, showPlaceholder } = resolveEmbedFrame({
    ready: embedReady && videoHeight != null,
    measuredHeight: videoHeight,
    fallbackHeight: defaultPlaceholderHeight,
    scale,
    height,
  });

  return (
    <div ref={boxRef} style={boxStyle}>
    <EmbedShell className={className} extraClassName="rsme-tiktok-embed" width="100%" height={frameHeight} borderRadius={borderRadius} style={{ position: 'relative', ...style }}>
      <div ref={containerRef} style={embedScaleStyle(scale, officialEmbedWidth)}>
      <Box className="tiktok-embed-container">
        <blockquote key={embedContainerKey} className="tiktok-embed" cite={url} data-video-id={embedId}>
          <section>
            <a href={url}>{linkText}</a>
          </section>
        </blockquote>
      </Box>
      </div>
      {showPlaceholder && !placeholderDisabled && resolvedPlaceholder != null ? (
        <Box style={placeholderOverlayStyle}>{resolvedPlaceholder}</Box>
      ) : null}
    </EmbedShell>
    </div>
  );
};
