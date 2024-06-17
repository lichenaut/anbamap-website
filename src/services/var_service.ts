export class EnvService {
  static getDockerVolume(): string {
    let DOCKER_VOLUME = process.env.DOCKER_VOLUME;
    if (DOCKER_VOLUME === undefined) {
      throw new Error("DOCKER_VOLUME is not defined");
    } else {
      return DOCKER_VOLUME;
    }
  }

  static getYouTubeApiKey(): string {
    let YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (YOUTUBE_API_KEY === undefined) {
      throw new Error("YOUTUBE_API_KEY is not defined");
    } else {
      return YOUTUBE_API_KEY;
    }
  }
}
