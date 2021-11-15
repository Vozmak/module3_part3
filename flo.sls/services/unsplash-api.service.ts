import { PutItemCommand, PutItemInput } from '@aws-sdk/client-dynamodb';
import { HttpInternalServerError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { DynamoClient } from '@services/dynamoDBClient';
import { S3Service } from '@services/s3.service';
import { SQSService } from '@services/sqs.service';
import axios, { AxiosResponse } from 'axios';
import * as crypto from 'crypto';

interface UnsplashImagesList {
  [k: string]: any;
}

interface ImageItem {
  email: string;
  receiptHandle: string;
  receiveCount: string;
  url: string;
  id: string;
}

export class UnsplashApiService {
  private readonly urlAPI = 'https://api.unsplash.com';
  private readonly queryEndpoint = 'search/photos';
  private readonly Client_ID = `Client-ID ${getEnv('UNSPLASH_CLIENT_ID')}`;

  async getImages(keyword: string, page: string): Promise<UnsplashImagesList> {
    let result: AxiosResponse;
    try {
      result = await axios.get(`${this.urlAPI}/${this.queryEndpoint}`, {
        params: {
          query: keyword,
          per_page: 30,
          page: page,
        },
        headers: {
          Authorization: this.Client_ID,
        },
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }

    return result.data;
  }

  async postImages(urlsList: Array<ImageItem>): Promise<void> {
    try {
      const S3 = new S3Service();
      const SQS = new SQSService(getEnv('IMAGES_QUEUE_URL'));
      for (const item of urlsList) {
        if (Number(item.receiveCount) > 10) await SQS.deleteMessage(item.receiptHandle);

        const imgBuffer: AxiosResponse = await axios.get(item.url, {
          responseType: 'arraybuffer',
        });

        if (imgBuffer.status !== 200) {
          return;
        }

        const type = item.url.replace(/.*(fm=(\w+)).*/, '$2');
        const imgName = `${item.id}.${type}`;
        const imgHash = crypto.createHash('sha1').update(imgName).digest('hex');

        const params: PutItemInput = {
          TableName: getEnv('USERS_TABLE_NAME'),
          Item: {
            UserEmail: {
              S: item.email,
            },
            UserData: {
              S: `Image_${imgHash}`,
            },
            imageName: {
              S: imgName,
            },
            Status: {
              S: 'OPEN',
            },
            Metadata: {
              S: JSON.stringify({
                ContentLength: imgBuffer.headers['content-length'],
                ContentType: imgBuffer.headers['content-type'],
              }),
            },
            URL: {
              S: `https://vstepanov-sls-dev-gallerys3.s3.amazonaws.com/${item.email}/${imgName}`,
            },
          },
        };
        const putCommand = new PutItemCommand(params);
        await DynamoClient.send(putCommand).catch(() => null);

        const res = S3.getPreSignedPutUrl(`${item.email}/${imgName}`, getEnv('IMAGES_BUCKET_NAME'));

        await axios
          .put(res, imgBuffer.data, {
            headers: {
              'Content-Type': imgBuffer.headers['content-type'],
            },
          })
          .catch(() => null);

        await SQS.deleteMessage(item.receiptHandle);
      }

      return;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
