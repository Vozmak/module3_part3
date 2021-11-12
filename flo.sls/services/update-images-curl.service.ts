import { HttpInternalServerError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { updateItemDB } from '@helper/gallery/updateItemDB';
import { S3Service } from '@services/s3.service';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import * as sharp from 'sharp';

export interface UploadValues {
  Path?: string;
  Status: 'OPEN' | 'CLOSED';
  Metadata?: string;
  SubClip: true | false;
}

export class UpdateImagesCurlService {
  private readonly S3 = new S3Service();

  async createSubClip(imageObject: GetObjectOutput, key: string): Promise<void> {
    console.log(1);
    const [userEmail, imageName] = key.split('/', 2);
    try {
      const image = sharp(imageObject.Body);
      const metadata = await image.metadata();
      delete metadata.icc;
      console.log(2);
      const subClip = await image
        .resize(512, 250, {
          fit: 'cover',
        })
        .toBuffer();
      console.log(3);
      await this.S3.put(
        `${userEmail}/_SC${imageName}`,
        subClip,
        getEnv('SUB_CLIP_IMAGES_BUCKET_NAME'),
        `images/${metadata.format}`
      );
      console.log(4);
      const updateValue: UploadValues = {
        Status: 'CLOSED',
        Metadata: JSON.stringify(metadata),
        SubClip: true,
      };
      console.log(5);
      await updateItemDB(userEmail, imageName, updateValue, true);
    } catch (error) {
      throw new HttpInternalServerError(error.message);
    }

    return;
  }
}
