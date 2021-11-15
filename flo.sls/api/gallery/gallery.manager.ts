import { HttpBadRequestError } from '@errors/http';
import { Gallery, PreSignerUrlResponse, Query } from './gallery.interface';
import { GalleryService } from './gallery.service';

export class GalleryManager {
  private readonly service: GalleryService;

  constructor() {
    this.service = new GalleryService();
  }

  getImages(querystring: Query): Promise<Gallery> {
    const page: string = querystring?.page || '1';
    const limit: string = querystring?.limit || '0';
    const filter: string = querystring?.filter || 'all';

    const numberPage = Number(page);
    const numberLimit = Number(limit);

    return this.service.getImages(numberPage, numberLimit, filter);
  }

  async getPreSignedPutUrl(imageName: string, userUploadEmail: string): Promise<PreSignerUrlResponse> {
    if (!imageName) {
      throw new HttpBadRequestError('Not found images for upload');
    }

    return this.service.getPreSignedPutUrl(imageName, userUploadEmail);
  }
}
