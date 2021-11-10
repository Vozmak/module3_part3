import { HttpBadRequestError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { S3Service } from '@services/s3.service';
import { S3EventRecord } from 'aws-lambda';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { UploadImagesService } from './update-images.service';

export class UploadImagesManager {
  private readonly service: UploadImagesService;

  constructor() {
    this.service = new UploadImagesService();
  }

  async updateImages(uploadInfo: S3EventRecord): Promise<void> {
    const S3 = new S3Service();
    const key = decodeURIComponent(uploadInfo.s3.object.key);

    if (!key) {
      throw new HttpBadRequestError('Key is required');
    }

    const imageMetadata: GetObjectOutput | null = await S3.get(key, getEnv('IMAGES_BUCKET_NAME'))
      .then((res) => res)
      .catch((e) => {
        if (e.code !== 'NoSuchKey') throw e;
        throw new HttpBadRequestError('Image not found');
      });

    return this.service.updateImages(key, imageMetadata, S3);
  }
}
