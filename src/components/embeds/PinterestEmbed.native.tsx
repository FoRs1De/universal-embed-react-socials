import { pinterestEmbedHtml } from './embedHtml';
import { NativeSocialEmbed } from './NativeSocialEmbed';
import type { PinterestEmbedProps } from './PinterestEmbed.types';

export type { PinterestEmbedProps } from './PinterestEmbed.types';

const officialEmbedHeight = 900;

export const PinterestEmbed = ({
  url,
  postUrl,
  placeholderText = 'View post on Pinterest',
  ...props
}: PinterestEmbedProps) => (
  <NativeSocialEmbed
    {...props}
    url={url}
    placeholderText={placeholderText}
    placeholderUrl={postUrl ?? url}
    html={pinterestEmbedHtml({ url: postUrl ?? url, fillWidth: true })}
    baseUrl="https://www.pinterest.com"
    autoHeight
    fallbackHeight={officialEmbedHeight}
  />
);
