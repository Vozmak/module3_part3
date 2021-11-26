import { HttpInternalServerError } from '@errors/http';
import { ObjectType } from '@interfaces/api-gateway-lambda.interface';
import { UnsplashApiService } from '@services/unsplash-api.service';
import { ImageItem, ImagesList } from './unsplash.interface';

export class UnsplashService {
  async getImagesUnsplash(query: ObjectType, unsplashApiService: UnsplashApiService): Promise<ImagesList> {
    let imagesList: ImagesList;
    try {
      const { keyword, page } = query;
      const { results, total_pages } = await unsplashApiService.getImages(keyword, page);
      imagesList = {
        total_pages: total_pages,
        result: results.map((image) => ({
          id: image.id,
          url: image.urls.full,
          likes: image.likes,
        })),
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }

    return imagesList;
  }

  async uploadUnsplashImages(urlsList: Array<ImageItem>, unsplashApiService: UnsplashApiService): Promise<void> {
    try {
      await unsplashApiService.postImages(urlsList);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }

    return;
  }
}
