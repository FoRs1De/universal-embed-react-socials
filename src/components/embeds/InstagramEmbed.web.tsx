import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement } from 'react';
import { useFrame } from '../../hooks/useFrame';
import { DEFAULT_INSTAGRAM_API_VERSION, normalizeInstagramApiVersion } from '../../utils/apiVersion';
import { classNames } from '../../utils/classNames';
import { isPercentage } from '../../utils/style';
import { Subs } from '../../utils/subs';
import { getCleanInstagramUrl } from '../../utils/urls';
import { generateUUID } from '../../uuid';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import type { InstagramEmbedProps } from './InstagramEmbed.types';

export type { InstagramEmbedProps } from './InstagramEmbed.types';

const minPlaceholderWidth = 328;
const defaultPlaceholderHeight = 372;
const borderRadius = 3;

const CHECK_SCRIPT_STAGE = 'check-script';
const LOAD_SCRIPT_STAGE = 'load-script';
const CONFIRM_SCRIPT_LOADED_STAGE = 'confirm-script-loaded';
const PROCESS_EMBED_STAGE = 'process-embed';
const CONFIRM_EMBED_SUCCESS_STAGE = 'confirm-embed-success';
const RETRYING_STAGE = 'retrying';
const EMBED_SUCCESS_STAGE = 'embed-success';

export const InstagramEmbed = ({
  url,
  width,
  height,
  linkText = 'View post on Instagram',
  captioned = false,
  placeholderImageUrl,
  placeholderSpinner,
  placeholderSpinnerDisabled = false,
  placeholderProps,
  embedPlaceholder,
  placeholderDisabled = false,
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
  const uuidRef = useRef(generateUUID());
  const [processTime, setProcessTime] = useState(Date.now());
  const embedContainerKey = useMemo(() => `${uuidRef.current}-${processTime}`, [processTime]);
  const frm = useFrame(frame);

  useEffect(() => {
    debug && console.log(`[${new Date().toISOString()}]: ${stage}`);
  }, [debug, stage]);

  useEffect(() => {
    if (stage !== CHECK_SCRIPT_STAGE) {
      return;
    }
    if ((frm.window as Window & { instgrm?: { Embeds?: { process?: () => void } } })?.instgrm?.Embeds?.process) {
      setStage(PROCESS_EMBED_STAGE);
    } else if (!scriptLoadDisabled) {
      setStage(LOAD_SCRIPT_STAGE);
    } else {
      console.error('Instagram embed script not found. Unable to process Instagram embed:', url);
    }
  }, [scriptLoadDisabled, stage, url, frm.window]);

  useEffect(() => {
    if (stage !== LOAD_SCRIPT_STAGE || !frm.document) {
      return;
    }
    const scriptElement = frm.document.createElement('script');
    scriptElement.setAttribute('src', 'https://www.instagram.com/embed.js');
    frm.document.head.appendChild(scriptElement);
    setStage(CONFIRM_SCRIPT_LOADED_STAGE);
  }, [stage, frm.document]);

  useEffect(() => {
    const subs = new Subs();
    if (stage === CONFIRM_SCRIPT_LOADED_STAGE) {
      subs.setInterval(() => {
        if ((frm.window as Window & { instgrm?: { Embeds?: { process?: () => void } } })?.instgrm?.Embeds?.process) {
          setStage(PROCESS_EMBED_STAGE);
        }
      }, 1);
    }
    return subs.createCleanup();
  }, [stage, frm.window]);

  useEffect(() => {
    if (stage !== PROCESS_EMBED_STAGE) {
      return;
    }
    const process = (frm.window as Window & { instgrm?: { Embeds?: { process?: () => void } } })?.instgrm?.Embeds
      ?.process;
    if (process) {
      process();
      setStage(CONFIRM_EMBED_SUCCESS_STAGE);
    } else {
      console.error('Instagram embed script not found. Unable to process Instagram embed:', url);
    }
  }, [stage, frm.window, url]);

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

  const cleanUrlWithEndingSlash = getCleanInstagramUrl(url);
  const percentageWidth = isPercentage(width);
  const percentageHeight = isPercentage(height);

  const placeholderStyle: CSSProperties = {
    minWidth: percentageWidth ? undefined : minPlaceholderWidth,
    width: typeof width !== 'undefined' ? (percentageWidth ? '100%' : width) : '100%',
    height: percentageHeight
      ? '100%'
      : typeof height !== 'undefined'
        ? height
        : typeof style?.height !== 'undefined' || typeof style?.maxHeight !== 'undefined'
          ? '100%'
          : defaultPlaceholderHeight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dee2e6',
    borderRadius,
  };
  const placeholder = embedPlaceholder ?? (
    <PlaceholderEmbed
      url={cleanUrlWithEndingSlash}
      imageUrl={placeholderImageUrl}
      linkText={linkText}
      spinner={placeholderSpinner}
      spinnerDisabled={placeholderSpinnerDisabled}
      {...placeholderProps}
      style={{ ...placeholderStyle, ...placeholderProps?.style }}
    />
  );

  return (
    <EmbedShell
      className={classNames(uuidRef.current, className)}
      extraClassName="rsme-instagram-embed"
      width={width}
      height={height}
      borderRadius={borderRadius}
      style={{ position: 'relative', ...style }}
    >
      <blockquote
        key={embedContainerKey}
        className="instagram-media"
        data-instgrm-permalink={`${cleanUrlWithEndingSlash}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version={resolvedVersion}
        data-instgrm-captioned={captioned ? captioned : undefined}
        data-width={percentageWidth ? '100%' : width ?? undefined}
        style={{ width: 'calc(100% - 2px)' }}
      >
        {!placeholderDisabled && placeholder}
        <div id={uuidRef.current} className="instagram-media-pre-embed rsme-d-none">
          &nbsp;
        </div>
      </blockquote>
    </EmbedShell>
  );
};
