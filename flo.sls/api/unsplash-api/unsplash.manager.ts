import { HttpBadRequestError } from '@errors/http';
import { HttpError } from '@errors/http/http-error';
import { ObjectType } from '@interfaces/api-gateway-lambda.interface';
import { UnsplashApiService } from '@services/unsplash-api.service';
import { ImageItem, ImagesList } from './unsplash.interface';
import { UnsplashService } from './unsplash.service';

export class UnsplashManager {
  private readonly service: UnsplashService;

  constructor() {
    this.service = new UnsplashService();
  }

  getImagesUnsplash(query: ObjectType, unsplashApiService: UnsplashApiService): Promise<ImagesList> {
    if (!query.keyword) {
      throw new HttpBadRequestError('Keyword is required');
    }

    if (!query.page) {
      throw new HttpBadRequestError('Page is required');
    }

    return this.service.getImagesUnsplash(query, unsplashApiService);
  }

  uploadUnsplashImages(urlsList: Array<ImageItem>, unsplashApiService: UnsplashApiService): Promise<void> {
    if (!urlsList || urlsList.length === 0) {
      throw new HttpError(404, 'Not found', 'Not found images for upload');
    }

    return this.service.uploadUnsplashImages(urlsList, unsplashApiService);
  }
}
