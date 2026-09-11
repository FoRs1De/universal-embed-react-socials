import { linkedinEmbedHtml } from './embedHtml';
import type { LinkedInEmbedProps } from './LinkedInEmbed.types';
import { NativeSocialEmbed } from './NativeSocialEmbed';

export type { LinkedInEmbedProps } from './LinkedInEmbed.types';

const officialEmbedHeight = 570;

export const LinkedInEmbed = ({
  url,
  postUrl,
  height,
  placeholderText = 'View post on LinkedIn',
  ...props
}: LinkedInEmbedProps) => (
  <NativeSocialEmbed
    {...props}
    url={url}
    height={height}
    placeholderText={placeholderText}
    placeholderUrl={postUrl ?? url}
    {...(height == null
      ? { html: linkedinEmbedHtml({ url }), autoHeight: true }
      : { uri: url })}
    baseUrl="https://www.linkedin.com"
    fallbackHeight={officialEmbedHeight}
  />
);
