import { UpdateImagesCurlService } from '@services/update-images-curl.service';
import { S3Handler } from 'aws-lambda';
import { log } from '@helper/logger';
import { errorHandler } from '@helper/rest-api/error-handler';
import { UploadImagesManager } from './update-images-manager';

export const updateImages: S3Handler = async (event) => {
  log(event);

  try {
    const manager = new UploadImagesManager();

    const uploadInfo = event.Records[0];

    const updateImagesCurlService = new UpdateImagesCurlService();

    return await manager.updateImages(uploadInfo, updateImagesCurlService);
  } catch (error) {
    return errorHandler(error);
  }
};
