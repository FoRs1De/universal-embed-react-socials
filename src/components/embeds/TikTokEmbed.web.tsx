import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement } from 'react';
import { Box } from '../../host';
import { useFrame } from '../../hooks/useFrame';
import { Subs } from '../../utils/subs';
import { getTikTokVideoId } from '../../utils/urls';
import { generateUUID } from '../../uuid';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import type { TikTokEmbedProps } from './TikTokEmbed.types';

export type { TikTokEmbedProps } from './TikTokEmbed.types';

const minPlaceholderWidth = 325;
const maxPlaceholderWidth = 480;
const defaultPlaceholderHeight = 550;
const borderRadius = 8;

const PROCESS_EMBED_STAGE = 'process-embed';
const CONFIRM_EMBED_SUCCESS_STAGE = 'confirm-embed-success';
const RETRYING_STAGE = 'retrying';
const EMBED_SUCCESS_STAGE = 'embed-success';

export const TikTokEmbed = ({
  url,
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
  const uuidRef = useRef(generateUUID());
  const [processTime, setProcessTime] = useState(Date.now());
  const embedContainerKey = useMemo(() => `${uuidRef.current}-${processTime}`, [processTime]);
  const frm = useFrame(frame);
  const embedId = getTikTokVideoId(url);

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
        if (frm.document && !frm.document.getElementById(uuidRef.current)) {
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
  }, [retryDelay, retryDisabled, stage, frm.document]);

  useEffect(() => {
    if (stage === RETRYING_STAGE) {
      setProcessTime(Date.now());
      setStage(PROCESS_EMBED_STAGE);
    }
  }, [stage]);

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
    <EmbedShell className={className} extraClassName="rsme-tiktok-embed" width={width} height={height} borderRadius={borderRadius} style={style}>
      <Box className="tiktok-embed-container">
        <blockquote key={embedContainerKey} className="tiktok-embed" cite={url} data-video-id={embedId}>
          {!placeholderDisabled ? (
            <div id={uuidRef.current} style={{ display: 'flex', justifyContent: 'center' }}>
              {placeholder}
            </div>
          ) : (
            <div id={uuidRef.current} style={{ display: 'none' }}>
              &nbsp;
            </div>
          )}
        </blockquote>
      </Box>
    </EmbedShell>
  );
};
