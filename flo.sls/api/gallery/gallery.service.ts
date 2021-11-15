import {
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { HttpBadRequestError, HttpInternalServerError } from '@errors/http';
import { HttpError } from '@errors/http/http-error';
import { getEnv } from '@helper/environment';
import { DynamoClient } from '@services/dynamoDBClient';
import { S3Service } from '@services/s3.service';
import { UpdateDynamodbItemService } from '@services/update-dynamodb-item.service';
import { Gallery, PreSignerUrlResponse, UploadValues } from './gallery.interface';

export class GalleryService {
  async getImages(page: number, limit: number, filter: string): Promise<Gallery> {
    let images: Array<string | undefined>;
    let total: number;

    try {
      const { Items } = await this.getImagesFromDB(filter);
      if (!Items) {
        throw new HttpError(404, 'Not Found', 'User not found.');
      } else if (Items.length === 0) {
        throw new HttpBadRequestError('User(s) upload 0 images');
      }

      if (limit === 0) {
        total = 1;
        images = Items.map((img) => img.URL.S);
      } else {
        total = Math.ceil(Items.length / limit);
        images = Items.slice((page - 1) * limit, page * limit).map((img) => img.URL.S);
      }

      if (page > total || page < 1) throw new HttpBadRequestError(`Page not found`);
    } catch (e) {
      if (e instanceof HttpBadRequestError) throw new HttpBadRequestError(e.message);
      else if (e instanceof HttpError) throw new HttpError(e.statusCode, e.name, e.message);
      throw new HttpInternalServerError(e.message);
    }

    return {
      objects: images,
      page: page,
      total: total,
    };
  }

  async getPreSignedPutUrl(imageName: string, userUploadEmail: string): Promise<PreSignerUrlResponse> {
    const updateDynamodbItemService = new UpdateDynamodbItemService();
    let imagePutUrl: string;
    try {
      const S3 = new S3Service();

      const key = `${userUploadEmail}/${imageName}`;
      imagePutUrl = S3.getPreSignedPutUrl(key, getEnv('IMAGES_BUCKET_NAME'));

      const putValues: UploadValues = {
        Path: imagePutUrl.split('?', 1)[0],
        Status: 'OPEN',
        SubClip: false,
      };
      await updateDynamodbItemService.updateDynamodbItem(userUploadEmail, imageName, putValues);
    } catch (e) {
      if (e instanceof HttpBadRequestError) {
        throw new HttpBadRequestError(e.message);
      }

      throw new HttpInternalServerError(e.message);
    }

    return { message: imagePutUrl };
  }

  async getImagesFromDB(filter: string): Promise<ScanCommandOutput | QueryCommandOutput> {
    let dynamoCommand: ScanCommand | QueryCommand;

    if (filter.toLowerCase() === 'all') {
      const params: ScanCommandInput = {
        TableName: getEnv('USERS_TABLE_NAME'),
        ProjectionExpression: '#URL',
        ExpressionAttributeNames: {
          '#UD': 'UserData',
          '#S': 'Status',
          '#URL': 'URL',
        },
        ExpressionAttributeValues: {
          ':userData': {
            S: 'Image_',
          },
          ':status': {
            S: 'CLOSED',
          },
        },
        FilterExpression: 'begins_with(#UD, :userData) AND #S = :status',
      };

      dynamoCommand = new ScanCommand(params);
    } else {
      const params: QueryCommandInput = {
        TableName: getEnv('USERS_TABLE_NAME'),
        ProjectionExpression: '#URL',
        ExpressionAttributeNames: {
          '#UE': 'UserEmail',
          '#UD': 'UserData',
          '#S': 'Status',
          '#URL': 'URL',
        },
        ExpressionAttributeValues: {
          ':userEmail': {
            S: filter,
          },
          ':userData': {
            S: 'Image_',
          },
          ':status': {
            S: 'CLOSED',
          },
        },
        KeyConditionExpression: '#UE = :userEmail AND begins_with ( #UD, :userData )',
        FilterExpression: '#S = :status',
      };

      dynamoCommand = new QueryCommand(params);
    }
    return await DynamoClient.send(dynamoCommand);
  }
}
