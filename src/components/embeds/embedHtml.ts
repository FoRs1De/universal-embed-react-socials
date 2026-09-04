import { getFacebookSdkSrc } from "../../utils/apiVersion";
import { escapeHtmlAttribute } from "../../utils/urls";
import { DEFAULT_XYMATIC_PLAYER_SCRIPT, getXymaticPlayerConfig } from "../../utils/xymatic";

const documentShell = (body: string): string => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>html,body{margin:0;padding:0;background:transparent;} iframe{max-width:100%;}</style>
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
    <div class="fb-post" data-href="${escapeHtmlAttribute(url)}" data-width="${escapeHtmlAttribute(String(width))}"></div>
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

export const tiktokEmbedHtml = ({
  url,
  videoId,
}: {
  url: string;
  videoId: string;
}): string =>
  documentShell(`
    <blockquote class="tiktok-embed" cite="${escapeHtmlAttribute(url)}" data-video-id="${escapeHtmlAttribute(videoId)}">
      <section></section>
    </blockquote>
    <script async src="https://www.tiktok.com/embed.js"></script>
  `);

export const xEmbedHtml = ({ postId }: { postId: string }): string =>
  documentShell(`
    <blockquote class="twitter-tweet">
      <a href="https://twitter.com/i/status/${escapeHtmlAttribute(postId)}"></a>
    </blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  `);

export const xymaticEmbedHtml = ({
  embedId,
  licenseKey,
  contentId,
  mixId,
  hasNoAds,
  scriptSrc = DEFAULT_XYMATIC_PLAYER_SCRIPT,
  pageTitle,
}: {
  embedId: string;
  licenseKey: string;
  contentId?: string;
  mixId?: string;
  hasNoAds?: boolean;
  scriptSrc?: string;
  pageTitle?: string;
}): string =>
  documentShell(`
    ${pageTitle ? `<script>document.title = ${JSON.stringify(pageTitle)};</script>` : ''}
    <div id="xymatic-embed-wrapper" style="width:100%;">
      <green-video
        embed-id="${escapeHtmlAttribute(embedId)}"
        ${contentId ? `content-id="${escapeHtmlAttribute(contentId)}"` : ''}
        ${mixId ? `mix-id="${escapeHtmlAttribute(mixId)}"` : ''}
      >
        <script type="application/json">${getXymaticPlayerConfig(hasNoAds)}</script>
      </green-video>
    </div>
    <script async src="${escapeHtmlAttribute(scriptSrc)}" data-license-key="${escapeHtmlAttribute(licenseKey)}"></script>
  `);
