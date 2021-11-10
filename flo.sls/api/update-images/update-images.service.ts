import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { HttpInternalServerError } from '@errors/http';
import { HttpError } from '@errors/http/http-error';
import { getEnv } from '@helper/environment';
import { updateItemDB } from '@helper/gallery/updateItemDB';
import { DynamoClient } from '@services/dynamoDBClient';
import { S3Service } from '@services/s3.service';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { UploadValues } from './update-images.interface';

export class UploadImagesService {
  async updateImages(key: string, metadata: GetObjectOutput, S3: S3Service): Promise<void> {
    try {
      const [userEmail, imageName] = key.split('/', 2);
      const imgGetURL: string = S3.getPreSignedGetUrl(key, getEnv('IMAGES_BUCKET_NAME')).split('?', 1)[0];
      const { ContentLength, ContentType } = metadata;

      const params: QueryCommandInput = {
        TableName: getEnv('USERS_TABLE_NAME'),
        ExpressionAttributeNames: {
          '#IN': 'imageName',
          '#UD': 'UserData',
          '#UE': 'UserEmail',
          '#S': 'Status',
        },
        ExpressionAttributeValues: {
          ':userData': {
            S: 'Image_',
          },
          ':imageName': {
            S: imageName,
          },
          ':userEmail': {
            S: userEmail,
          },
          ':status': {
            S: 'OPEN',
          },
        },
        FilterExpression: '#IN = :imageName AND #S = :status',
        KeyConditionExpression: '#UE = :userEmail AND begins_with(#UD, :userData)',
      };
      const queryCommand = new QueryCommand(params);
      const { Items } = await DynamoClient.send(queryCommand);
      if (!Items) {
        throw new HttpError(404, 'Not Found', 'User not found.');
      } else if (Items.length === 0) {
        throw new HttpError(404, 'Not Found', 'Image not found.');
      }

      const updateValue: UploadValues = {
        Path: imgGetURL,
        Metadata: JSON.stringify({
          ContentLength: ContentLength,
          ContentType: ContentType,
        }),
        Status: 'CLOSED',
      };
      await updateItemDB(userEmail, imageName, updateValue, true);
    } catch (error) {
      throw new HttpInternalServerError(error.message);
    }

    return;
  }
}
