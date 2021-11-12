import { HttpInternalServerError } from '@errors/http';
import { ObjectType } from '@interfaces/api-gateway-lambda.interface';
import { UnsplashCurlService } from '@services/unsplash-curl.service';
import { ImageItem, ImagesList } from './unsplash.interface';

export class UnsplashService {
  async getImagesUnsplash(query: ObjectType, unsplashCurlService: UnsplashCurlService): Promise<ImagesList> {
    let imagesList: ImagesList;
    try {
      const { keyword, page } = query;
      const { results, total_pages } = await unsplashCurlService.getImages(keyword, page);
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

  async uploadUnsplashImages(urlsList: Array<ImageItem>, unsplashCurlService: UnsplashCurlService): Promise<void> {
    try {
      await unsplashCurlService.postImages(urlsList);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }

    return;
  }
}
