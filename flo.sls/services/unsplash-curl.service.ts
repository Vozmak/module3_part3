import { HttpInternalServerError } from '@errors/http';
import { getEnv } from '@helper/environment';
import fetch from 'node-fetch';

export class UnsplashCurlService {
  private readonly urlAPI = 'https://api.unsplash.com';
  private readonly queryEndpoint = 'search/photos';
  private readonly Client_ID = `Client-ID ${getEnv('UNSPLASH_CLIENT_ID')}`;

  async getImages(keyword: string) {
    let result;
    try {
      const unsplashResponse = await fetch(`${this.urlAPI}/${this.queryEndpoint}?query=${keyword}&per_page=1`, {
        method: 'get',
        headers: {
          Authorization: this.Client_ID,
        },
      });

      result = await unsplashResponse.json();
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }

    return result;
  }
}
