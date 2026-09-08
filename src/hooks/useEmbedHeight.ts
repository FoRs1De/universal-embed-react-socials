import { useEffect, useRef, useState } from 'react';
import { MAX_EMBED_HEIGHT, MIN_EMBED_HEIGHT } from '../utils/embedHeight';
import { embedMaxWidthStyle } from '../utils/style';

export const useResponsiveEmbedScale = (
  designWidth: number,
  {
    allowUpscale = false,
    initialWidth,
  }: { allowUpscale?: boolean; initialWidth?: number } = {},
) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [boxWidth, setBoxWidth] = useState(
    initialWidth && initialWidth > 0 ? initialWidth : designWidth,
  );

  useEffect(() => {
    const node = boxRef.current;
    if (!node || typeof ResizeObserver === 'undefined') {
      return;
    }
    const update = () => {
      const next = Math.round(node.getBoundingClientRect().width);
      if (next > 0) {
        setBoxWidth((prev) => (Math.abs(prev - next) < 2 ? prev : next));
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const rawScale = designWidth > 0 ? boxWidth / designWidth : 1;
  return {
    boxRef,
    boxWidth,
    scale: allowUpscale ? rawScale : Math.min(1, rawScale),
  };
};

export const useResponsiveEmbedBox = (
  designWidth: number,
  maxWidth?: string | number,
  options?: { allowUpscale?: boolean; fallbackMaxWidth?: number },
) => {
  const { boxRef, boxWidth, scale } = useResponsiveEmbedScale(designWidth, {
    allowUpscale: options?.allowUpscale ?? true,
    initialWidth: typeof maxWidth === 'number' && maxWidth > 0 ? maxWidth : undefined,
  });
  return {
    boxRef,
    boxWidth,
    scale,
    // Omit maxWidth → fill the parent. A design-width fallback kept scale at 1.
    boxStyle: embedMaxWidthStyle(
      maxWidth,
      maxWidth == null ? undefined : (options?.fallbackMaxWidth ?? designWidth),
    ),
  };
};

export const parseEmbedHeight = (data: unknown, depth = 0): number | undefined => {
  if (depth > 4 || data == null) {
    return undefined;
  }
  if (typeof data === 'number') {
    return data >= MIN_EMBED_HEIGHT && data <= MAX_EMBED_HEIGHT ? Math.round(data) : undefined;
  }
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (!trimmed) {
      return undefined;
    }
    try {
      return parseEmbedHeight(JSON.parse(trimmed), depth + 1);
    } catch {
      const match = trimmed.match(/(?:height|frameHeight|scrollHeight|h)["'\s:=]+(\d{2,4})/i);
      return match ? parseEmbedHeight(Number(match[1]), depth + 1) : undefined;
    }
  }
  if (Array.isArray(data)) {
    for (const item of data) {
      const next = parseEmbedHeight(item, depth + 1);
      if (next) {
        return next;
      }
    }
    return undefined;
  }
  if (typeof data === 'object') {
    const record = data as Record<string, unknown>;
    for (const key of ['height', 'frameHeight', 'iframeHeight', 'iframe_height', 'scrollHeight']) {
      const next = parseEmbedHeight(record[key], depth + 1);
      if (next) {
        return next;
      }
    }
    for (const key of ['payload', 'params', 'data', 'message', 'value']) {
      const next = parseEmbedHeight(record[key], depth + 1);
      if (next) {
        return next;
      }
    }
  }
  return undefined;
};

export const useAutoEmbedHeight = ({
  enabled = true,
  fallback,
  aspectRatio,
  listenToMessages = false,
  allowedOrigins = [],
  measureSrcDoc = false,
  measureSelector,
}: {
  enabled?: boolean;
  fallback?: number;
  aspectRatio?: number;
  listenToMessages?: boolean;
  allowedOrigins?: string[];
  measureSrcDoc?: boolean;
  measureSelector?: string;
} = {}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = useState<number | undefined>();
  const [measuredWidth, setMeasuredWidth] = useState<number | undefined>();

  useEffect(() => {
    if (!enabled || !listenToMessages) {
      return;
    }
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin ?? '';
      const originAllowed =
        allowedOrigins.length === 0 || allowedOrigins.some((item) => origin.includes(item));
      if (!originAllowed) {
        return;
      }
      const iframe = iframeRef.current;
      if (iframe && event.source && allowedOrigins.length === 0 && event.source !== iframe.contentWindow) {
        return;
      }
      const next = parseEmbedHeight(event.data);
      if (next) {
        setMeasured((prev) => (prev === next ? prev : next));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [allowedOrigins, enabled, listenToMessages]);

  useEffect(() => {
    if (!enabled || !measureSrcDoc) {
      return;
    }
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    let resizeObserver: ResizeObserver | undefined;
    let mutationObserver: MutationObserver | undefined;
    let srcWindow: Window | null = null;

    const handleFrameMessage = (event: MessageEvent) => {
      const next = parseEmbedHeight(event.data);
      if (next) {
        setMeasured((prev) => (prev === next ? prev : next));
      }
    };

    const readSize = () => {
      const doc = iframe.contentDocument;
      if (!doc) {
        return;
      }
      const source = measureSelector
        ? doc.querySelector<HTMLElement>(measureSelector)
        : doc.querySelector<HTMLElement>('[class*="embed_pin"]') ??
          doc.querySelector<HTMLElement>('iframe');
      if (!source) {
        return;
      }
      const rect = source.getBoundingClientRect();
      const nextHeight = Math.ceil(Math.max(rect.height, source.scrollHeight));
      const nextWidth = Math.ceil(Math.max(rect.width, source.scrollWidth));
      if (nextHeight >= MIN_EMBED_HEIGHT) {
        setMeasured((prev) => (prev === nextHeight ? prev : nextHeight));
      }
      if (nextWidth >= MIN_EMBED_HEIGHT) {
        setMeasuredWidth((prev) => (prev === nextWidth ? prev : nextWidth));
      }
    };

    const isElement = (node: unknown): node is Element =>
      !!node && typeof node === 'object' && (node as Node).nodeType === 1;

    const attach = () => {
      const doc = iframe.contentDocument;
      const root = doc?.documentElement;
      if (!doc || !isElement(root)) {
        return;
      }
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(readSize);
        resizeObserver.observe(root);
        if (isElement(doc.body)) {
          resizeObserver.observe(doc.body);
        }
      }
      mutationObserver = new MutationObserver(() => {
        const inner = doc.querySelector(measureSelector ?? '[class*="embed_pin"], iframe');
        if (isElement(inner) && resizeObserver) {
          resizeObserver.observe(inner);
        }
        readSize();
      });
      mutationObserver.observe(root, { childList: true, subtree: true, attributes: true });
      srcWindow?.removeEventListener('message', handleFrameMessage);
      srcWindow = doc.defaultView;
      srcWindow?.addEventListener('message', handleFrameMessage);
      readSize();
    };

    iframe.addEventListener('load', attach);
    attach();
    return () => {
      iframe.removeEventListener('load', attach);
      srcWindow?.removeEventListener('message', handleFrameMessage);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [enabled, measureSelector, measureSrcDoc]);

  useEffect(() => {
    if (!enabled || listenToMessages || measureSrcDoc) {
      return;
    }
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') {
      return;
    }

    const readHeight = () => {
      if (aspectRatio) {
        const width = node.getBoundingClientRect().width;
        if (width > 0) {
          const next = Math.round(width / aspectRatio);
          setMeasured((prev) => (prev === next ? prev : next));
        }
        return;
      }
      const iframe = node.querySelector('iframe');
      const widget =
        node.querySelector<HTMLElement>('[class*="embed_pin"]') ?? iframe ?? node;
      const next = Math.ceil(Math.max(widget.scrollHeight, widget.offsetHeight));
      if (next >= MIN_EMBED_HEIGHT) {
        setMeasured((prev) => (prev === next ? prev : next));
      }
    };

    readHeight();
    const resizeObserver = new ResizeObserver(readHeight);
    resizeObserver.observe(node);
    const mutationObserver = new MutationObserver(() => {
      const iframe = node.querySelector('iframe');
      if (iframe) {
        resizeObserver.observe(iframe);
      }
      readHeight();
    });
    mutationObserver.observe(node, { childList: true, subtree: true, attributes: true });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [aspectRatio, enabled, listenToMessages, measureSrcDoc]);

  return {
    height: enabled ? (measured ?? fallback) : fallback,
    width: measuredWidth,
    measured,
    iframeRef,
    containerRef,
  };
};
