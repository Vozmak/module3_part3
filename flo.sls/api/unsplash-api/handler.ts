import { getEnv } from '@helper/environment';
import { SQSService } from '@services/sqs.service';
import { UnsplashCurlService } from '@services/unsplash-curl.service';
import { SQSHandler, SQSRecord } from 'aws-lambda';
import { Handler } from 'aws-lambda/handler';
import { log } from '@helper/logger';
import { errorHandler } from '@helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';
import { ImageItem, ImagesList, UploadBodyImages } from './unsplash.interface';
import { UnsplashManager } from './unsplash.manager';

export const getImagesUnsplash: Handler<APIGatewayLambdaEvent<null>, ImagesList> = async (event) => {
  log(event);

  try {
    const manager = new UnsplashManager();

    const query = event.query;

    const unsplashCurlService = new UnsplashCurlService();

    return await manager.getImagesUnsplash(query, unsplashCurlService);
  } catch (error) {
    return errorHandler(error);
  }
};

export const uploadUnsplashImages: SQSHandler = async (event) => {
  log(event);

  try {
    const manager = new UnsplashManager();

    const sqsMessages: Array<SQSRecord> = event.Records;
    const urls: Array<ImageItem> = sqsMessages.map((item) => {
      const body = JSON.parse(item.body);
      return {
        receiptHandle: item.receiptHandle,
        receiveCount: item.attributes.ApproximateReceiveCount,
        email: body.email,
        url: body.url,
        id: body.id,
      };
    });

    console.log(urls);

    const unsplashCurlService = new UnsplashCurlService();

    return manager.uploadUnsplashImages(urls, unsplashCurlService);
  } catch (error) {
    return errorHandler(error);
  }
};

export const sendMessageSQS: Handler<APIGatewayLambdaEvent<UploadBodyImages>, string> = async (event) => {
  log(event);
  try {
    const { urls } = event.body;
    const { context: email } = event.enhancedAuthContext;

    const sqs = new SQSService(getEnv('IMAGES_QUEUE_URL'));
    for (const item of urls) {
      item.email = email;
      await sqs.sendMessage(JSON.stringify(item));
    }

    return 'Images sent. Loading time from 1 min to 2 hours';
  } catch (error) {
    return errorHandler(error);
  }
};
