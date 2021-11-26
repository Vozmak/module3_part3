import { UploadSubClipService } from '@services/upload-subclip.service';
import { S3Handler } from 'aws-lambda';
import { log } from '@helper/logger';
import { errorHandler } from '@helper/rest-api/error-handler';
import { UploadImagesManager } from './upload-subclip-image.manager';

export const uploadSubClipImage: S3Handler = async (event) => {
  log(event);

  try {
    const manager = new UploadImagesManager();

    const uploadInfo = event.Records[0];

    const uploadSubClipService = new UploadSubClipService();

    return await manager.uploadSubClipImage(uploadInfo, uploadSubClipService);
  } catch (error) {
    return errorHandler(error);
  }
};
