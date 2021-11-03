import { HttpInternalServerError } from '@errors/http';
import { UnsplashCurlService } from '@services/unsplash-curl.service';

export class UnsplashService {
  async getImagesList(keyword: string, unsplashCurlService: UnsplashCurlService) {
    try {
      const { results: imagesList } = await unsplashCurlService.getImages(keyword);
      console.log(imagesList);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
