# universal-embed-react-socials

Embed posts from Facebook, Instagram, LinkedIn, Pinterest, TikTok, X (Twitter), and YouTube in **React** and **React Native**. Configurable platform API versions available.

On web, embeds use the official platform scripts and iframes. On React Native, paired `.native` files render a `WebView` (`react-native-webview`).

## Install

```bash
npm i universal-embed-react-socials
```

React Native also needs:

```bash
npm i react-native-webview
```

## Usage

```jsx
import { FacebookEmbed, InstagramEmbed } from 'universal-embed-react-socials';

<FacebookEmbed
  url="https://www.facebook.com/andrewismusic/posts/451971596293956"
  maxWidth={550}
  apiVersion="v26.0"
/>

<InstagramEmbed
  url="https://www.instagram.com/p/CUbHfhpswxt/"
  maxWidth={328}
  apiVersion="14"
  captioned
/>
```

### Facebook

```jsx
import { FacebookEmbed } from "universal-embed-react-socials";

<FacebookEmbed
  url="https://www.facebook.com/andrewismusic/posts/451971596293956"
  maxWidth={550}
  apiVersion="v26.0"
  locale="en_US"
/>;
```

`apiVersion` accepts `v26.0`, `26.0`, `v26`, or `26`. Default is `v26.0` (current Graph API).

### Instagram

```jsx
import { InstagramEmbed } from "universal-embed-react-socials";

<InstagramEmbed
  url="https://www.instagram.com/p/CUbHfhpswxt/"
  maxWidth={328}
  apiVersion="14"
  captioned
/>;
```

`apiVersion` maps to Instagram's `data-instgrm-version`. The original `igVersion` prop still works; `apiVersion` wins if both are set.

### LinkedIn

```jsx
import { LinkedInEmbed } from "universal-embed-react-socials";

<LinkedInEmbed
  url="https://www.linkedin.com/embed/feed/update/urn:li:share:6898694772484112384"
  postUrl="https://www.linkedin.com/posts/peterdiamandis_5-discoveries-the-james-webb-telescope-will-activity-6898694773406875648-z-D7"
  maxWidth={325}
  height={570}
/>;
```

Use the `src` from LinkedIn's "Embed this post" iframe.

### Pinterest

```jsx
import { PinterestEmbed } from "universal-embed-react-socials";

<PinterestEmbed
  url="https://www.pinterest.com/pin/99360735500167749/"
  maxWidth={345}
  height={467}
/>;
```

### TikTok

```jsx
import { TikTokEmbed } from "universal-embed-react-socials";

<TikTokEmbed
  url="https://www.tiktok.com/@epicgardening/video/7055411162212633903"
  maxWidth={325}
/>;
```

### X (Twitter)

```jsx
import { XEmbed } from "universal-embed-react-socials";

<XEmbed
  url="https://twitter.com/PixelAndBracket/status/1356633038717923333"
  maxWidth={325}
/>;
```

`TwitterEmbed` is still exported as a deprecated alias of `XEmbed`.

### YouTube

```jsx
import { YouTubeEmbed } from "universal-embed-react-socials";

<YouTubeEmbed
  url="https://www.youtube.com/watch?v=HpVOs5imUN0"
  maxWidth={325}
  height={220}
/>;
```

Shorts (`youtube.com/shorts/ID`) and `youtu.be` links work. Extra player options go through `youTubeProps.opts.playerVars`.

## React vs React Native

Platform-specific code lives in paired `.web.tsx` and `.native.tsx` files. Metro picks the native files; the web build flattens `.web` files for React DOM. Native embeds use `View` and `WebView` JSX.

You do not need `react-native` installed for a web-only app. Omit `maxWidth` to fill the parent; pass `maxWidth` to cap it. On React Native, omit `height` to size from the embed when the platform reports it.

On React Native, tapped embed links open in the system browser by default. Pass `openLinksInBrowser={false}` to keep navigation inside the WebView.

```jsx
<YouTubeEmbed
  url="https://www.youtube.com/watch?v=HpVOs5imUN0"
  openLinksInBrowser
/>
```

Pass extra `react-native-webview` options with `webViewProps` (ignored on web):

```jsx
<FacebookEmbed
  url="https://www.facebook.com/andrewismusic/posts/451971596293956"
  maxWidth={550}
  height={372}
  webViewProps={{
    allowsInlineMediaPlayback: true,
    userAgent: 'custom-ua',
    onMessage: (event) => console.log(event.nativeEvent.data),
  }}
/>
```

## Shared embed props

Every embed accepts:

- `url`
- `maxWidth` / `height` — `maxWidth` caps the embed; it fills its container up to that size and shrinks with the viewport. Omit `height` to size from the embed when the platform reports it. `width` still works as a deprecated alias of `maxWidth`.
- `linkText`
- `placeholder` — custom loading UI. Replaces the default placeholder.
- `placeholderWidth` / `placeholderHeight` / `placeholderStyle` — optional overrides. By default the placeholder matches the embed size, or the provider’s default size before the embed has measured.
- `placeholderImageUrl` / `placeholderSpinner` / `placeholderSpinnerDisabled` / `placeholderProps`
- `placeholderDisabled` — hide the placeholder. `embedPlaceholder` still works as a deprecated alias of `placeholder`.
- `className` / `style`
- `webViewProps` (React Native only)
- `openLinksInBrowser` (React Native only) — open tapped embed links in the system browser. Defaults to `true`. Ignored on web.

Instagram and TikTok also support `scriptLoadDisabled`, `retryDelay`, `retryDisabled`, `frame`, and `debug`.

## API version helpers

```ts
import {
  DEFAULT_FACEBOOK_API_VERSION,
  DEFAULT_INSTAGRAM_API_VERSION,
  normalizeFacebookApiVersion,
  getFacebookSdkSrc,
} from "universal-embed-react-socials";
```

## License

MIT
