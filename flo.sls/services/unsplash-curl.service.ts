import { HttpInternalServerError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { S3Service } from '@services/s3.service';
import axios, { AxiosResponse } from 'axios';

interface UnsplashImagesList {
  [k: string]: any;
}

interface ImageItem {
  url: string;
  id: string;
}

export class UnsplashCurlService {
  private readonly urlAPI = 'https://api.unsplash.com';
  private readonly queryEndpoint = 'search/photos';
  private readonly Client_ID = `Client-ID ${getEnv('UNSPLASH_CLIENT_ID')}`;

  async getImages(keyword: string, page: string): Promise<UnsplashImagesList> {
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

  async postImages(email: string, urlsList: Array<ImageItem>): Promise<string> {
    try {
      const S3 = new S3Service();
      for (const item of urlsList) {
        const imgBuffer: AxiosResponse = await axios.get(item.url, {
          responseType: 'arraybuffer',
        });

        const type = item.url.replace(/.*(fm=(\w+)).*/, '$2');
        const res = S3.getPreSignedPutUrl(`${email}/${item.id}.${type}`, getEnv('IMAGES_BUCKET_NAME'));

        await axios
          .put(res, imgBuffer.data, {
            headers: {
              'Content-Type': imgBuffer.headers['content-type'],
            },
          })
          .catch(() => {
            return null;
          });
      }
      return 'Images Upload';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
