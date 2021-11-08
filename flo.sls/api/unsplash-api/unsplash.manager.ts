import { ObjectType } from '@interfaces/api-gateway-lambda.interface';
import { UnsplashCurlService } from '@services/unsplash-curl.service';
import { ImagesList } from './unsplash.interface';
import { UnsplashService } from './unsplash.service';

export class UnsplashManager {
  private readonly service: UnsplashService;

  constructor() {
    this.service = new UnsplashService();
  }

  getImagesList(query: ObjectType, unsplashCurlService: UnsplashCurlService): Promise<ImagesList> {
    return this.service.getImagesList(query, unsplashCurlService);
  }
}
