const isTikTokHost = (host: string): boolean =>
  host === 'tiktok.com' || host.endsWith('.tiktok.com');

/** Bypass app-install redirects that can leave Safari opening an unsupported app scheme. */
export const resolveTikTokBrowserUrl = (targetUrl: string, postUrl: string): string => {
  try {
    const target = new URL(targetUrl);
    const isAppScheme = /^(?:tiktok|snssdk\d+):$/.test(target.protocol);
    const isWebRedirect =
      (target.protocol === 'https:' || target.protocol === 'http:') &&
      (/^snssdk\d+\.onelink\.me$/.test(target.hostname) ||
        (isTikTokHost(target.hostname) && /^\/(?:download-link|link)(?:\/|$)/.test(target.pathname)));
    if (!isAppScheme && !isWebRedirect) {
      return targetUrl;
    }

    const post = new URL(postUrl);
    if (!isTikTokHost(post.hostname) || !/^https?:$/.test(post.protocol)) {
      return targetUrl;
    }
    post.protocol = 'https:';
    post.search = '';
    post.hash = '';
    return post.toString();
  } catch {
    return targetUrl;
  }
};
