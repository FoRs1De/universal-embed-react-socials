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

export const xEmbedHtml = ({ postId }: { postId: string }): string =>
  documentShell(`
    <blockquote class="twitter-tweet">
      <a href="https://twitter.com/i/status/${escapeHtmlAttribute(postId)}"></a>
    </blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  `);
