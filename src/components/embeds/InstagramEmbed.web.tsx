import { useEffect, useId, useState, type ReactElement } from 'react';
import { Box } from '../../host';
import { useAutoEmbedHeight, useResponsiveEmbedBox } from '../../hooks/useEmbedHeight';
import { useFrame } from '../../hooks/useFrame';
import { DEFAULT_INSTAGRAM_API_VERSION, normalizeInstagramApiVersion } from '../../utils/apiVersion';
import { classNames } from '../../utils/classNames';
import { embedScaleStyle, placeholderOverlayStyle, resolveEmbedFrame, resolveEmbedMaxWidth } from '../../utils/style';
import { Subs } from '../../utils/subs';
import { getCleanInstagramUrl } from '../../utils/urls';
import { resolveEmbedPlaceholder } from '../placeholder/resolveEmbedPlaceholder';
import { EmbedShell } from './EmbedShell';
import type { InstagramEmbedProps } from './InstagramEmbed.types';

export type { InstagramEmbedProps } from './InstagramEmbed.types';

const defaultPlaceholderHeight = 740;
const captionedPlaceholderHeight = 820;
const officialEmbedWidth = 550;
const borderRadius = 3;
const INSTAGRAM_SCRIPT_ID = 'instagram-embed-script';

const CHECK_SCRIPT_STAGE = 'check-script';
const LOAD_SCRIPT_STAGE = 'load-script';
const CONFIRM_SCRIPT_LOADED_STAGE = 'confirm-script-loaded';
const PROCESS_EMBED_STAGE = 'process-embed';
const CONFIRM_EMBED_SUCCESS_STAGE = 'confirm-embed-success';
const RETRYING_STAGE = 'retrying';
const EMBED_SUCCESS_STAGE = 'embed-success';

const instagramProcess = (win?: Window) =>
  (win as Window & { instgrm?: { Embeds?: { process?: () => void } } } | undefined)?.instgrm?.Embeds
    ?.process;

export const InstagramEmbed = ({
  url,
  maxWidth,
  width,
  height,
  linkText = 'View post on Instagram',
  captioned = false,
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
  scriptLoadDisabled = false,
  retryDelay = 5000,
  retryDisabled = false,
  igVersion = DEFAULT_INSTAGRAM_API_VERSION,
  apiVersion,
  frame = undefined,
  debug = false,
  className,
  style,
}: InstagramEmbedProps): ReactElement => {
  const resolvedVersion = normalizeInstagramApiVersion(apiVersion ?? igVersion);
  const [stage, setStage] = useState(CHECK_SCRIPT_STAGE);
  const embedId = useId();
  const [processTime, setProcessTime] = useState(0);
  const embedContainerKey = `${embedId}-${processTime}`;
  const frm = useFrame(frame);

  useEffect(() => {
    if (embedDisabled) {
      return;
    }
    debug && console.log(`[${new Date().toISOString()}]: ${stage}`);
  }, [debug, embedDisabled, stage]);

  useEffect(() => {
    if (embedDisabled || stage !== CHECK_SCRIPT_STAGE) {
      return;
    }
    if (instagramProcess(frm.window)) {
      setStage(PROCESS_EMBED_STAGE);
    } else if (!scriptLoadDisabled) {
      setStage(LOAD_SCRIPT_STAGE);
    } else {
      console.error('Instagram embed script not found. Unable to process Instagram embed:', url);
    }
  }, [scriptLoadDisabled, stage, url, frm.window, embedDisabled]);

  useEffect(() => {
    if (embedDisabled || stage !== LOAD_SCRIPT_STAGE || !frm.document) {
      return;
    }
    if (!frm.document.getElementById(INSTAGRAM_SCRIPT_ID)) {
      const scriptElement = frm.document.createElement('script');
      scriptElement.id = INSTAGRAM_SCRIPT_ID;
      scriptElement.async = true;
      scriptElement.setAttribute('src', 'https://www.instagram.com/embed.js');
      frm.document.head.appendChild(scriptElement);
    }
    setStage(CONFIRM_SCRIPT_LOADED_STAGE);
  }, [stage, frm.document, embedDisabled]);

  useEffect(() => {
    if (embedDisabled) {
      return;
    }
    const subs = new Subs();
    if (stage === CONFIRM_SCRIPT_LOADED_STAGE) {
      subs.setInterval(() => {
        if (instagramProcess(frm.window)) {
          setStage(PROCESS_EMBED_STAGE);
        }
      }, 50);
    }
    return subs.createCleanup();
  }, [stage, frm.window, embedDisabled]);

  useEffect(() => {
    if (embedDisabled || stage !== PROCESS_EMBED_STAGE) {
      return;
    }
    const process = instagramProcess(frm.window);
    if (process) {
      process();
      setStage(CONFIRM_EMBED_SUCCESS_STAGE);
    } else {
      console.error('Instagram embed script not found. Unable to process Instagram embed:', url);
    }
  }, [stage, frm.window, url, embedDisabled]);

  useEffect(() => {
    if (embedDisabled) {
      return;
    }
    const subs = new Subs();
    if (stage === CONFIRM_EMBED_SUCCESS_STAGE) {
      subs.setInterval(() => {
        if (frm.document && !frm.document.getElementById(embedId)) {
          setStage(EMBED_SUCCESS_STAGE);
        }
      }, 50);
      if (!retryDisabled) {
        subs.setTimeout(() => {
          setStage(RETRYING_STAGE);
        }, retryDelay);
      }
    }
    return subs.createCleanup();
  }, [embedId, retryDelay, retryDisabled, stage, frm.document, embedDisabled]);

  useEffect(() => {
    if (embedDisabled || stage !== RETRYING_STAGE) {
      return;
    }
    setProcessTime(Date.now());
    setStage(PROCESS_EMBED_STAGE);
  }, [stage, embedDisabled]);

  const cleanUrlWithEndingSlash = getCleanInstagramUrl(url);
  const resolvedMaxWidth = resolveEmbedMaxWidth(maxWidth, width);
  const fallbackHeight = captioned ? captionedPlaceholderHeight : defaultPlaceholderHeight;
  const { boxRef, scale, boxStyle } = useResponsiveEmbedBox(officialEmbedWidth, resolvedMaxWidth);
  const { height: observedHeight, containerRef } = useAutoEmbedHeight({
    enabled: !embedDisabled && height == null,
  });
  const embedReady = !embedDisabled && stage === EMBED_SUCCESS_STAGE;

  const resolvedPlaceholder = resolveEmbedPlaceholder({
    url: cleanUrlWithEndingSlash,
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
      borderColor: '#dee2e6',
      borderRadius,
    },
    embedWidth: '100%',
    embedHeight: '100%',
    providerWidth: officialEmbedWidth,
    providerHeight: fallbackHeight,
  });
  const { frameHeight, showPlaceholder } = resolveEmbedFrame({
    ready: embedReady,
    measuredHeight: observedHeight,
    fallbackHeight,
    scale,
    height,
  });

  return (
    <div ref={boxRef} style={boxStyle}>
    <EmbedShell
      className={classNames(embedId, className)}
      extraClassName="rsme-instagram-embed"
      width="100%"
      height={frameHeight}
      borderRadius={borderRadius}
      style={{ position: 'relative', ...style }}
    >
      <div ref={containerRef} style={embedScaleStyle(scale, officialEmbedWidth)}>
      {embedDisabled ? null : (
      <blockquote
        key={embedContainerKey}
        className="instagram-media"
        data-instgrm-permalink={`${cleanUrlWithEndingSlash}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version={resolvedVersion}
        data-instgrm-captioned={captioned ? captioned : undefined}
        data-width={officialEmbedWidth}
        style={{ width: 'calc(100% - 2px)' }}
      >
        <div id={embedId} className="instagram-media-pre-embed rsme-d-none">
          &nbsp;
        </div>
      </blockquote>
      )}
      </div>
      {showPlaceholder && !placeholderDisabled && resolvedPlaceholder != null ? (
        <Box style={placeholderOverlayStyle}>{resolvedPlaceholder}</Box>
      ) : null}
    </EmbedShell>
    </div>
  );
};
