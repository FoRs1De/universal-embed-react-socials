import { AUTO_HEIGHT_TOPIC } from "./nativeEmbedHeight";
import { getFacebookSdkSrc } from "../../utils/apiVersion";
import { escapeHtmlAttribute } from "../../utils/urls";

const documentShell = (body: string): string => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;} blockquote,.tiktok-embed,.instagram-media,.twitter-tweet,.fb-post,iframe,[class*="embed_pin"]{display:block;margin:0 !important;max-width:100%;}</style>
  </head>
  <body>
    ${body}
  </body>
</html>`;

export const facebookEmbedHtml = ({
  url,
  width,
  apiVersion,
  locale,
}: {
  url: string;
  width: string | number;
  apiVersion: string;
  locale: string;
}): string =>
  documentShell(`
    <div id="fb-root"></div>
    <div class="fb-post" data-href="${escapeHtmlAttribute(url)}" data-width="${escapeHtmlAttribute(String(width))}" data-show-text="true"></div>
    <script async defer src="${escapeHtmlAttribute(getFacebookSdkSrc(apiVersion, locale))}"></script>
  `);

export const instagramEmbedHtml = ({
  url,
  apiVersion,
  captioned,
}: {
  url: string;
  apiVersion: string;
  captioned: boolean;
}): string =>
  documentShell(`
    <blockquote
      class="instagram-media"
      data-instgrm-permalink="${escapeHtmlAttribute(`${url}?utm_source=ig_embed&utm_campaign=loading`)}"
      data-instgrm-version="${escapeHtmlAttribute(apiVersion)}"
      ${captioned ? 'data-instgrm-captioned="true"' : ""}
      style="width:calc(100% - 2px);"
    ></blockquote>
    <script async src="https://www.instagram.com/embed.js"></script>
  `);

/** Pinterest `data-pin-width="large"` widget is 600px. */
export const PINTEREST_DESIGN_WIDTH = 600;

/**
 * Pinterest's hosted `embed.html` centers a fixed-width pin in a 450px page,
 * which cannot be made responsive from the outside. Render the official
 * `pinit.js` widget in a page we own instead. On web, `fillWidth` scales that
 * 600px widget up to the iframe's client width and posts the visual height.
 */
export const pinterestEmbedHtml = ({
  url,
  fillWidth = false,
  embedId = '',
}: {
  url: string;
  fillWidth?: boolean;
  embedId?: string;
}): string => {
  const pin = `<a data-pin-do="embedPin" data-pin-width="large" href="${escapeHtmlAttribute(url)}"></a>`;
  if (!fillWidth) {
    return documentShell(`
      <style>
        html,body{width:${PINTEREST_DESIGN_WIDTH}px;overflow:visible;}
        iframe,span,img,[class*="embed_pin"]{max-width:none !important;margin:0 !important;}
      </style>
      ${pin}
      <script async defer src="https://assets.pinterest.com/js/pinit.js"></script>
    `);
  }
  return documentShell(`
    <style>
      html,body{width:100%;margin:0;padding:0;overflow:hidden;}
      #pin-wrap{width:${PINTEREST_DESIGN_WIDTH}px;transform-origin:top left;}
      #pin-wrap iframe,#pin-wrap span,#pin-wrap img,[class*="embed_pin"]{max-width:none !important;margin:0 !important;}
    </style>
    <div id="pin-wrap">${pin}</div>
    <script>
      (function () {
        var DESIGN = ${PINTEREST_DESIGN_WIDTH};
        var wrap = document.getElementById('pin-wrap');
        var id = ${JSON.stringify(embedId)};
        function fit() {
          var pin = wrap.querySelector('iframe, span, [data-pin-id]');
          if (!pin) return;
          var viewport = document.documentElement.clientWidth || DESIGN;
          var pinW = pin.offsetWidth || wrap.offsetWidth || DESIGN;
          if (pinW < 50) return;
          wrap.style.transform = 'scale(' + (viewport / pinW) + ')';
          wrap.style.transformOrigin = 'top left';
          var visualH = Math.ceil(wrap.getBoundingClientRect().height) + 2;
          if (visualH < 50) return;
          document.documentElement.style.height = visualH + 'px';
          document.body.style.height = visualH + 'px';
          window.parent.postMessage({ source: 'rsme-pinterest', id: id, height: visualH }, '*');
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ topic: '${AUTO_HEIGHT_TOPIC}', height: visualH }));
          }
        }
        window.addEventListener('resize', fit);
        if (typeof ResizeObserver !== 'undefined') new ResizeObserver(fit).observe(wrap);
        if (typeof MutationObserver !== 'undefined') {
          new MutationObserver(fit).observe(wrap, { childList: true, subtree: true, attributes: true });
        }
        var n = 0;
        var t = setInterval(function () { fit(); if (++n > 40) clearInterval(t); }, 250);
        fit();
      })();
    </script>
    <script async defer src="https://assets.pinterest.com/js/pinit.js"></script>
  `);
};

export const xEmbedHtml = ({ postId }: { postId: string }): string =>
  documentShell(`
    <blockquote class="twitter-tweet">
      <a href="https://twitter.com/i/status/${escapeHtmlAttribute(postId)}"></a>
    </blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  `);

/** LinkedIn's embed iframe is a fixed 504×570 design. Scale it to the WebView width. */
export const LINKEDIN_DESIGN_WIDTH = 504;
export const LINKEDIN_DESIGN_HEIGHT = 570;

export const linkedinEmbedHtml = ({ url }: { url: string }): string =>
  documentShell(`
    <style>
      html,body{width:100%;margin:0;padding:0;overflow:hidden;background:transparent;}
      #li-wrap{width:${LINKEDIN_DESIGN_WIDTH}px;transform-origin:top left;}
      iframe{border:0;display:block;margin:0;}
    </style>
    <div id="li-wrap">
      <iframe src="${escapeHtmlAttribute(url)}" width="${LINKEDIN_DESIGN_WIDTH}" height="${LINKEDIN_DESIGN_HEIGHT}" title="LinkedIn embed"></iframe>
    </div>
    <script>
      (function () {
        var DESIGN = ${LINKEDIN_DESIGN_WIDTH};
        var DESIGN_H = ${LINKEDIN_DESIGN_HEIGHT};
        var wrap = document.getElementById('li-wrap');
        function fit() {
          if (!wrap) return;
          var viewport = document.documentElement.clientWidth || DESIGN;
          wrap.style.transform = 'scale(' + (viewport / DESIGN) + ')';
          var visualH = Math.ceil(DESIGN_H * (viewport / DESIGN)) + 2;
          document.documentElement.style.height = visualH + 'px';
          document.body.style.height = visualH + 'px';
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ topic: '${AUTO_HEIGHT_TOPIC}', height: visualH }));
          }
        }
        window.addEventListener('resize', fit);
        window.addEventListener('load', fit);
        fit();
      })();
    </script>
  `);

