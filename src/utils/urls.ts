export const getYouTubeVideoId = (url: string): string => {
  const videoIdMatch = url.match(/[?&]v=(.+?)(?:$|[&?])/)?.[1];
  const shortsIdMatch = url.match(/https:\/\/(?:www\.)?youtube\.com\/shorts\/(.+?)(?:$|[&?])/)?.[1];
  const shortLinkMatch = url.match(/https:\/\/youtu\.be\/(.+?)(?:$|[&?])/)?.[1];
  const embedLinkMatch = url.match(/https:\/\/(?:www\.)youtube(?:-nocookie)?\.com\/embed\/(.+?)(?:$|[&?])/)?.[1];
  return videoIdMatch ?? shortsIdMatch ?? shortLinkMatch ?? embedLinkMatch ?? '00000000';
};

export const getYouTubeStart = (url: string): number => +(url.match(/[?&]start=(\d+)/)?.[1] ?? 0);

export const getXPostId = (url: string): string => url.substring(url.lastIndexOf('/') + 1).replace(/[?].*$/, '');

export const getTikTokVideoId = (url: string): string => url.replace(/[?].*$/, '').replace(/^.+\//, '');

export const getPinterestPinId = (url: string): string => url.match(/pin\/([\w\d_-]+)/)?.[1] ?? '000000000000000000';

export const getCleanInstagramUrl = (url: string): string => {
  const urlWithNoQueryOrUsername = url
    .split(/[?#]/)[0]
    .replace(/\.com\/.*?\/p/, '.com/p')
    .replace(/\.com\/.*?\/reel/, '.com/reel');
  return `${urlWithNoQueryOrUsername}${urlWithNoQueryOrUsername.endsWith('/') ? '' : '/'}`;
};

export const escapeHtmlAttribute = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
