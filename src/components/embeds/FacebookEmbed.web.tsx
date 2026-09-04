import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Box } from '../../host';
import { useFrame } from '../../hooks/useFrame';
import {
  DEFAULT_FACEBOOK_API_VERSION,
  DEFAULT_FACEBOOK_LOCALE,
  getFacebookSdkSrc,
} from '../../utils/apiVersion';
import { classNames } from '../../utils/classNames';
import { isPercentage } from '../../utils/style';
import { Subs } from '../../utils/subs';
import { generateUUID } from '../../uuid';
import { PlaceholderEmbed } from '../placeholder/PlaceholderEmbed';
import { EmbedShell } from './EmbedShell';
import type { FacebookEmbedProps } from './FacebookEmbed.types';

export type { FacebookEmbedProps } from './FacebookEmbed.types';

const defaultEmbedWidth = 550;
const maxPlaceholderWidth = defaultEmbedWidth;
const defaultPlaceholderHeight = 372;
const borderRadius = 3;

const CHECK_SCRIPT_STAGE = 'check-script';
const LOAD_SCRIPT_STAGE = 'load-script';
const CONFIRM_SCRIPT_LOADED_STAGE = 'confirm-script-loaded';
const PROCESS_EMBED_STAGE = 'process-embed';
const CONFIRM_EMBED_SUCCESS_STAGE = 'confirm-embed-success';
const RETRYING_STAGE = 'retrying';
const EMBED_SUCCESS_STAGE = 'embed-success';

export const FacebookEmbed = ({
  url,
  width,
  height,
  linkText = 'View post on Facebook',
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
  apiVersion = DEFAULT_FACEBOOK_API_VERSION,
  locale = DEFAULT_FACEBOOK_LOCALE,
  className,
  style,
}: FacebookEmbedProps) => {
  const [stage, setStage] = useState(CHECK_SCRIPT_STAGE);
  const embedSuccess = useMemo(() => stage === EMBED_SUCCESS_STAGE, [stage]);
  const uuidRef = useRef(generateUUID());
  const [processTime, setProcessTime] = useState(Date.now());
  const embedContainerKey = useMemo(() => `${uuidRef.current}-${processTime}`, [processTime]);
  const frm = useFrame(frame);
  const scriptSrc = getFacebookSdkSrc(apiVersion, locale);

  useEffect(() => {
    debug && console.log(`[${new Date().toISOString()}]: ${stage}`);
  }, [debug, stage]);

  useEffect(() => {
    if (stage !== CHECK_SCRIPT_STAGE) {
      return;
    }
    if ((frm.window as Window & { FB?: { XFBML?: { parse?: () => void } } })?.FB?.XFBML?.parse) {
      setStage(PROCESS_EMBED_STAGE);
    } else if (!scriptLoadDisabled) {
      setStage(LOAD_SCRIPT_STAGE);
    } else {
      console.error('Facebook embed script not found. Unable to process Facebook embed:', url);
    }
  }, [scriptLoadDisabled, stage, url, frm.window]);

  useEffect(() => {
    if (stage !== LOAD_SCRIPT_STAGE || !frm.document) {
      return;
    }
    const scriptElement = frm.document.createElement('script');
    scriptElement.setAttribute('src', scriptSrc);
    frm.document.head.appendChild(scriptElement);
    setStage(CONFIRM_SCRIPT_LOADED_STAGE);
  }, [stage, frm.document, scriptSrc]);

  useEffect(() => {
    const subs = new Subs();
    if (stage === CONFIRM_SCRIPT_LOADED_STAGE) {
      subs.setInterval(() => {
        if ((frm.window as Window & { FB?: { XFBML?: { parse?: () => void } } })?.FB?.XFBML?.parse) {
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
    const parse = (frm.window as Window & { FB?: { XFBML?: { parse?: () => void } } })?.FB?.XFBML?.parse;
    if (parse) {
      parse();
      setStage(CONFIRM_EMBED_SUCCESS_STAGE);
    } else {
      console.error('Facebook embed script not found. Unable to process Facebook embed:', url);
    }
  }, [stage, url, frm.window]);

  useEffect(() => {
    const subs = new Subs();
    if (stage === CONFIRM_EMBED_SUCCESS_STAGE) {
      subs.setInterval(() => {
        if (frm.document) {
          const fbPostContainerElement = frm.document.getElementById(uuidRef.current);
          const fbPostElem = fbPostContainerElement?.getElementsByClassName('fb-post')[0];
          if (fbPostElem && fbPostElem.children.length > 0) {
            setStage(EMBED_SUCCESS_STAGE);
          }
        }
      }, 1);
      if (!retryDisabled) {
        subs.setTimeout(() => {
          setStage(RETRYING_STAGE);
        }, retryDelay);
      }
    }
    return subs.createCleanup();
  }, [retryDisabled, retryDelay, stage, frm.document]);

  useEffect(() => {
    if (stage === RETRYING_STAGE) {
      setProcessTime(Date.now());
      setStage(PROCESS_EMBED_STAGE);
    }
  }, [stage]);

  const percentageWidth = isPercentage(width);
  const percentageHeight = isPercentage(height);
  const resolvedWidth = percentageWidth ? '100%' : width ?? defaultEmbedWidth;

  const placeholderStyle: CSSProperties = {
    maxWidth: percentageWidth ? undefined : maxPlaceholderWidth,
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
    <EmbedShell className={className} extraClassName="rsme-facebook-embed" width={width} height={height} borderRadius={borderRadius} style={style}>
      <Box id={uuidRef.current} className={classNames(!embedSuccess && 'rsme-d-none')}>
        <div
          key={embedContainerKey}
          className="fb-post"
          data-href={url}
          data-width={resolvedWidth}
          style={{
            width: resolvedWidth,
            height: percentageHeight ? '100%' : height ?? undefined,
          }}
        />
      </Box>
      {!embedSuccess && !placeholderDisabled && placeholder}
    </EmbedShell>
  );
};
