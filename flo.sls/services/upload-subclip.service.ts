import { HttpInternalServerError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { S3Service } from '@services/s3.service';
import { UpdateImagesService } from '@services/update-images.service';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import * as sharp from 'sharp';

export interface UploadValues {
  Path?: string;
  Status: 'OPEN' | 'CLOSED';
  Metadata?: string;
  SubClip: true | false;
}

export class UploadSubClipService {
  private readonly S3 = new S3Service();
  private readonly UpdateDynamodbItemService = new UpdateImagesService();

  async uploadSubClipImage(imageObject: GetObjectOutput, key: string): Promise<void> {
    const [userEmail, imageName] = key.split('/', 2);
    try {
      const image = sharp(imageObject.Body);
      const metadata = await image.metadata();
      delete metadata.icc;

      const subClip = await image
        .resize(512, 250, {
          fit: 'cover',
        })
        .toBuffer();

      await this.S3.put(
        `${userEmail}/_SC${imageName}`,
        subClip,
        getEnv('SUB_CLIP_IMAGES_BUCKET_NAME'),
        `images/${metadata.format}`
      );

      const updateValue: UploadValues = {
        Status: 'CLOSED',
        Metadata: JSON.stringify(metadata),
        SubClip: true,
      };

      await this.UpdateDynamodbItemService.updateDynamodbItem(userEmail, imageName, updateValue, true);
    } catch (error) {
      throw new HttpInternalServerError(error.message);
    }

    return;
  }
}
