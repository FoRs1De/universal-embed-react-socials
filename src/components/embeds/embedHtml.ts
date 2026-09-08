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

/**
 * Pinterest's hosted `embed.html` centers a fixed-width pin in a 450px page,
 * which cannot be made responsive from the outside. Render the official
 * `pinit.js` widget in a page we own instead, then scale it to the viewport.
 */
export const pinterestEmbedHtml = ({ url }: { url: string }): string =>
  documentShell(`
    <style>
      #rsme-pin-box{width:100%;overflow:hidden;}
      #rsme-pin-scale{transform-origin:top left;display:inline-block;}
      #rsme-pin-scale iframe,#rsme-pin-scale span,#rsme-pin-scale img{max-width:none !important;}
    </style>
    <div id="rsme-pin-box">
      <div id="rsme-pin-scale">
        <a data-pin-do="embedPin" data-pin-width="large" href="${escapeHtmlAttribute(url)}"></a>
      </div>
    </div>
    <script async defer src="https://assets.pinterest.com/js/pinit.js"></script>
    <script>
      (function () {
        var box = document.getElementById('rsme-pin-box');
        var scale = document.getElementById('rsme-pin-scale');
        var lastRatio = 0;
        var lastHeight = 0;
        var settledTimes = 0;
        var maxSettledTimes = 6;
        var timer;

        function schedule() {
          clearTimeout(timer);
          if (settledTimes < maxSettledTimes) {
            timer = setTimeout(fit, 500);
          }
        }

        function fit() {
          var node = scale.firstElementChild;
          var target = document.documentElement.clientWidth || window.innerWidth || 0;
          var w = node ? node.offsetWidth : 0;
          var h = node ? node.offsetHeight : 0;
          if (!target || w < 50 || h < 50) {
            schedule();
            return;
          }
          var ratio = target / w;
          var height = Math.ceil(h * ratio);
          if (ratio === lastRatio && height === lastHeight) {
            settledTimes++;
          } else {
            settledTimes = 0;
            lastRatio = ratio;
            lastHeight = height;
            scale.style.width = w + 'px';
            scale.style.transform = 'scale(' + ratio + ')';
            box.style.height = height + 'px';
          }
          schedule();
        }

        function refit() {
          settledTimes = 0;
          fit();
        }

        window.addEventListener('load', refit);
        window.addEventListener('resize', refit);
        if (window.MutationObserver) {
          // Attributes are intentionally not observed: fit() writes inline styles inside the box.
          new MutationObserver(refit).observe(box, { childList: true, subtree: true });
        }
        fit();
      })();
    </script>
  `);

export const xEmbedHtml = ({ postId }: { postId: string }): string =>
  documentShell(`
    <blockquote class="twitter-tweet">
      <a href="https://twitter.com/i/status/${escapeHtmlAttribute(postId)}"></a>
    </blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  `);
