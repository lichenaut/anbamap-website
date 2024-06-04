export class EnvService {
  static getYouTubeApiKey(): string {
    let YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (YOUTUBE_API_KEY === undefined) {
      throw new Error("YOUTUBE_API_KEY is not defined");
    } else {
      return YOUTUBE_API_KEY;
    }
  }
}
