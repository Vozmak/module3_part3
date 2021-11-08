import { HttpInternalServerError } from '@errors/http';
import { getEnv } from '@helper/environment';
import axios, { AxiosResponse } from 'axios';

export class UnsplashCurlService {
  private readonly urlAPI = 'https://api.unsplash.com';
  private readonly queryEndpoint = 'search/photos';
  private readonly Client_ID = `Client-ID ${getEnv('UNSPLASH_CLIENT_ID')}`;

  async getImages(keyword: string, page: string): Promise<any> {
    let result: AxiosResponse;
    try {
      result = await axios.get(`${this.urlAPI}/${this.queryEndpoint}`, {
        params: {
          query: keyword,
          per_page: 30,
          page: page,
        },
        headers: {
          Authorization: this.Client_ID,
        },
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }

    return result.data;
  }
}
