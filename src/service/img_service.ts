import { EnvService } from "./var_service";

let YOUTUBE_API_KEY: string;

let imageUrlCache: Map<string, string> = new Map();
export async function fetchImageUrl(url: string) {
  if (url.includes("youtube.com/watch?v=")) {
    if (YOUTUBE_API_KEY === undefined) {
      YOUTUBE_API_KEY = EnvService.getYouTubeApiKey();
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
  }
}
