import { HttpInternalServerError } from '@errors/http';
import { ObjectType } from '@interfaces/api-gateway-lambda.interface';
import { UnsplashCurlService } from '@services/unsplash-curl.service';
import { ImagesList } from './unsplash.interface';

export class UnsplashService {
  async getImagesList(query: ObjectType, unsplashCurlService: UnsplashCurlService): Promise<ImagesList> {
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
}
