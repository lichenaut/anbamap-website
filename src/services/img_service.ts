import { EnvService } from "./var_service";

let YOUTUBE_API_KEY: string | undefined;

let imageUrlCache: Map<string, string> = new Map();
export async function fetchImageUrl(url: string) {
  if (url.includes("youtube.com/watch?v=")) {
    if (YOUTUBE_API_KEY === undefined) {
      YOUTUBE_API_KEY = EnvService.getEnvVar("YOUTUBE_API_KEY");
    }
    if (YOUTUBE_API_KEY === undefined) {
      return fetchFaviconUrl(url);
    }

    let videoParts = url.split("watch?v=");
    let videoId = videoParts[videoParts.length - 1];
    let videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    let data = await videoResponse.json();
    let channelId = data.items[0].snippet.channelId;
    if (imageUrlCache.has(channelId)) {
      return imageUrlCache.get(channelId);
    }

    let channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    let channelData = await channelResponse.json();
    let channelIcon = channelData.items[0].snippet.thumbnails.default.url;
    imageUrlCache.set(channelId, channelIcon);
    return channelIcon;
  } else {
    return fetchFaviconUrl(url);
  }
}

export async function fetchFaviconUrl(url: string) {
  let urlOrigin = new URL(url).origin;
  if (imageUrlCache.has(urlOrigin)) {
    return imageUrlCache.get(urlOrigin);
  }

  let faviconUrl = `https://www.google.com/s2/favicons?domain=${url}`;
  imageUrlCache.set(urlOrigin, faviconUrl);
  return faviconUrl;
}
