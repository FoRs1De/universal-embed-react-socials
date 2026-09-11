const isTikTokHost = (host: string): boolean =>
  host === 'tiktok.com' || host.endsWith('.tiktok.com');

const nestedValueLooksLikeAppRedirect = (value: string): boolean => {
  try {
    const decoded = decodeURIComponent(value);
    if (/^(?:tiktok|snssdk\d+):/i.test(decoded)) {
      return true;
    }
    const nested = new URL(decoded);
    return (
      /^snssdk\d+\.onelink\.me$/i.test(nested.hostname) ||
      (nested.hostname.endsWith('.tiktokv.com') &&
        nested.pathname.startsWith('/redirect'))
    );
  } catch {
    return /(?:tiktok|snssdk\d+):|onelink\.me/i.test(value);
  }
};

const isTikTokAppInstallRedirect = (target: URL): boolean => {
  if (
    (target.protocol === 'https:' || target.protocol === 'http:') &&
    target.hostname.endsWith('.tiktokv.com') &&
    target.pathname.startsWith('/redirect')
  ) {
    return true;
  }

  for (const key of ['redirect_url', 'dl']) {
    const nested = target.searchParams.get(key);
    if (nested && nestedValueLooksLikeAppRedirect(nested)) {
      return true;
    }
  }

  return false;
};

/** Bypass app-install redirects that can leave Safari opening an unsupported app scheme. */
export const resolveTikTokBrowserUrl = (
  targetUrl: string,
  postUrl: string,
): string => {
  try {
    const target = new URL(targetUrl);
    const isAppScheme = /^(?:tiktok|snssdk\d+):$/i.test(target.protocol);
    const isWebRedirect =
      (target.protocol === 'https:' || target.protocol === 'http:') &&
      (/^snssdk\d+\.onelink\.me$/i.test(target.hostname) ||
        (isTikTokHost(target.hostname) &&
          /^\/(?:download-link|link)(?:\/|$)/.test(target.pathname)) ||
        isTikTokAppInstallRedirect(target));
    if (!isAppScheme && !isWebRedirect) {
      return targetUrl;
    }

    const post = new URL(postUrl);
    if (!isTikTokHost(post.hostname) || !/^https?:$/i.test(post.protocol)) {
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
