import {
  PutItemCommand,
  PutItemCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { HttpInternalServerError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { DynamoClient } from '@services/dynamoDBClient';
import * as crypto from 'crypto';

export interface UploadValues {
  Path?: string;
  Status: 'OPEN' | 'CLOSED';
  Metadata?: string;
  SubClip: true | false;
}

export class UpdateImagesService {
  async updateDynamodbItem(userEmail: string, imageName: string, values: UploadValues, exists = false): Promise<void> {
    // let paramsAll: UpdateItemCommandInput | undefined;

    try {
      const imgHash = crypto.createHash('sha1').update(imageName).digest('hex');

      if (exists) {
        const paramsUser: UpdateItemCommandInput = {
          TableName: getEnv('USERS_TABLE_NAME'),
          ExpressionAttributeNames: {
            '#S': 'Status',
            '#M': 'Metadata',
            '#SC': 'subclipCreated',
          },
          ExpressionAttributeValues: {
            ':status': {
              S: values.Status,
            },
            ':metadata': {
              S: values.Metadata || JSON.stringify({ message: 'Metadata not found' }),
            },
            ':sccreated': {
              BOOL: values.SubClip,
            },
          },
          Key: {
            UserEmail: {
              S: userEmail,
            },
            UserData: {
              S: `Image_${imgHash}`,
            },
          },
          UpdateExpression: `SET #S = :status, #M = :metadata, #SC = :sccreated`,
        };
        const updateCommand = new UpdateItemCommand(paramsUser);
        await DynamoClient.send(updateCommand);
        // paramsAll = {
        //   TableName: getEnv('USERS_TABLE_NAME'),
        //   ExpressionAttributeNames: {
        //     '#I': 'Images',
        //   },
        //   ExpressionAttributeValues: {
        //     ':imgInfo': {
        //       L: [putValues],
        //     },
        //     ':emptyList': {
        //       L: [],
        //     },
        //   },
        //   Key: {
        //     UserEmail: {
        //       S: 'all',
        //     },
        //   },
        //   UpdateExpression: 'SET #I = list_append(if_not_exists(#I, :emptyList), :imgInfo)',
        // };
      } else {
        const paramsUser: PutItemCommandInput = {
          TableName: getEnv('USERS_TABLE_NAME'),
          Item: {
            UserEmail: {
              S: userEmail,
            },
            UserData: {
              S: `Image_${imgHash}`,
            },
            imageName: {
              S: imageName,
            },
            URL: {
              S: values.Path!,
            },
            Status: {
              S: values.Status,
            },
          },
        };
        const PutCommand = new PutItemCommand(paramsUser);
        await DynamoClient.send(PutCommand);
      }
    } catch (err) {
      throw new HttpInternalServerError(err.message);
    }

    return;
  }
}
