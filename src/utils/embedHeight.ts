export const MIN_EMBED_HEIGHT = 50;
export const MAX_EMBED_HEIGHT = 4000;

/** Providers report a placeholder height before the real content settles. */
export const isStubEmbedHeight = (height: number): boolean =>
  height === 1000 || height >= 1500;
