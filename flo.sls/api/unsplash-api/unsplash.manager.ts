import { UnsplashCurlService } from '@services/unsplash-curl.service';
import { UnsplashService } from './unsplash.service';

export class UnsplashManager {
  private readonly service: UnsplashService;

  constructor() {
    this.service = new UnsplashService();
  }

  getImagesList(keyword: string, unsplashCurlService: UnsplashCurlService) {
    return this.service.getImagesList(keyword, unsplashCurlService)
  }
}
