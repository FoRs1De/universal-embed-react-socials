const MIN_EMBED_HEIGHT = 50;
const MAX_EMBED_HEIGHT = 4000;
export const AUTO_HEIGHT_TOPIC = 'rsme-ah';

export const isStubEmbedHeight = (height: number): boolean =>
  height === 1000 || height >= 1500;

export const parseAutoHeightMessage = (data: unknown): number | undefined => {
  if (data == null) {
    return undefined;
  }
  let payload: unknown = data;
  if (typeof data === 'string') {
    try {
      payload = JSON.parse(data);
    } catch {
      return undefined;
    }
  }
  if (typeof payload !== 'object' || payload == null) {
    return undefined;
  }
  const record = payload as { topic?: unknown; height?: unknown };
  if (record.topic !== AUTO_HEIGHT_TOPIC || typeof record.height !== 'number') {
    return undefined;
  }
  if (
    record.height < MIN_EMBED_HEIGHT ||
    record.height > MAX_EMBED_HEIGHT ||
    isStubEmbedHeight(record.height)
  ) {
    return undefined;
  }
  return Math.round(record.height);
};

/**
 * Pinterest's embed.html has no viewport and sizes the body to 100vh.
 * Pin the layout to the official pin width and report the full card height
 * (image + caption + attribution), never the image alone.
 */
export const nativePinterestBootScript = (designWidth: number): string => `
  (function () {
    if (window.__rsmePin) {
      return;
    }
    window.__rsmePin = 1;
    var width = ${designWidth};
    var topic = '${AUTO_HEIGHT_TOPIC}';
    var lastHeight = 0;
    var viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      if (document.head) {
        document.head.appendChild(viewport);
      }
    }
    viewport.setAttribute(
      'content',
      'width=' + width + ', initial-scale=1, maximum-scale=1, user-scalable=no'
    );
    document.documentElement.style.width = width + 'px';
    document.documentElement.style.maxWidth = width + 'px';
    if (document.body) {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.width = width + 'px';
      document.body.style.maxWidth = width + 'px';
      document.body.style.textAlign = 'left';
    }

    function cardNode() {
      var named = document.querySelector('[class*="embed_pin"]');
      if (named && named.tagName !== 'IMG') {
        return named;
      }
      var img = document.querySelector('img');
      if (!img) {
        return null;
      }
      var node = img.parentElement;
      while (node && node !== document.body) {
        if (node.tagName !== 'IMG' && node.querySelector('img') && (node.innerText || '').trim().length > 0) {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    }

    function report() {
      if (!window.ReactNativeWebView || !window.ReactNativeWebView.postMessage) {
        return;
      }
      var card = cardNode();
      if (!card) {
        return;
      }
      if (document.body) {
        document.body.style.height = 'auto';
        document.body.style.minHeight = '0';
      }
      var rect = card.getBoundingClientRect();
      var height = Math.ceil(Math.max(rect.bottom, rect.height));
      if (!height || height === lastHeight) {
        return;
      }
      lastHeight = height;
      window.ReactNativeWebView.postMessage(JSON.stringify({ topic: topic, height: height }));
    }

    var scheduled = 0;
    function schedule() {
      if (scheduled) {
        return;
      }
      scheduled = 1;
      setTimeout(function () {
        scheduled = 0;
        report();
      }, 100);
    }

    window.addEventListener('load', schedule);
    if (window.MutationObserver && document.documentElement) {
      new MutationObserver(schedule).observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
    schedule();
    true;
  })();
`;

/**
 * Same approach as @brown-bear/react-native-autoheight-webview:
 * wrap body contents, measure the wrapper, and re-run on mutations / delayed checks.
 * https://github.com/giannistolou/react-native-autoheight-webview
 */
export const nativeAutoHeightScript = `
  (function () {
    if (window.__rsmeAh) {
      return;
    }
    window.__rsmeAh = 1;
    var topic = '${AUTO_HEIGHT_TOPIC}';
    var lastHeight = 0;
    var heightTheSameTimes = 0;
    var maxHeightTheSameTimes = 5;
    var forceRefreshDelay = 1000;
    var forceRefreshTimeout;
    var checkPostMessageTimeout;

    if (!document.getElementById('rsme-ah-style')) {
      var styleElement = document.createElement('style');
      styleElement.id = 'rsme-ah-style';
      styleElement.innerHTML = 'html,body,#rsme-ah-wrapper{margin:0;padding:0;height:auto;min-height:0;}blockquote,.tiktok-embed,.instagram-media,.twitter-tweet,.fb-post,iframe{margin:0!important;}';
      document.head.appendChild(styleElement);
    }

    var wrapper = document.getElementById('rsme-ah-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'rsme-ah-wrapper';
      var child = document.body.firstChild;
      while (child) {
        var next = child.nextSibling;
        if (child.nodeName !== 'SCRIPT') {
          wrapper.appendChild(child);
        }
        child = next;
      }
      document.body.insertBefore(wrapper, document.body.firstChild);
    }

    var scheduled = 0;
    function updateSize() {
      if (document.fullscreenElement) {
        return;
      }
      if (!window.ReactNativeWebView || !window.ReactNativeWebView.postMessage) {
        checkPostMessageTimeout = setTimeout(updateSize, 200);
        return;
      }
      clearTimeout(checkPostMessageTimeout);
      var result = wrapper.getBoundingClientRect();
      var height = result.top > 0 ? result.height + result.top : result.height;
      if (!height) {
        height = wrapper.offsetHeight || document.documentElement.offsetHeight;
      }
      height = Math.ceil(height);
      if (height && height !== lastHeight) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ topic: topic, height: height }));
      }
      clearTimeout(forceRefreshTimeout);
      if (lastHeight !== height) {
        heightTheSameTimes = 1;
      } else {
        heightTheSameTimes++;
      }
      lastHeight = height;
      if (heightTheSameTimes <= maxHeightTheSameTimes) {
        forceRefreshTimeout = setTimeout(scheduleUpdate, heightTheSameTimes * forceRefreshDelay);
      }
    }
    function scheduleUpdate() {
      if (scheduled) {
        return;
      }
      scheduled = 1;
      setTimeout(function () {
        scheduled = 0;
        updateSize();
      }, 100);
    }

    window.addEventListener('load', scheduleUpdate);
    window.addEventListener('resize', scheduleUpdate);
    var Observer = window.MutationObserver || window.WebKitMutationObserver;
    if (Observer) {
      new Observer(scheduleUpdate).observe(wrapper, { childList: true, subtree: true });
    }
    updateSize();
    true;
  })();
`;

export const injectAutoHeightScript = (html: string, script: string): string => {
  const tag = `<script>${script}</script>`;
  if (html.includes('</body>')) {
    return html.replace('</body>', `${tag}</body>`);
  }
  return `${html}${tag}`;
};
