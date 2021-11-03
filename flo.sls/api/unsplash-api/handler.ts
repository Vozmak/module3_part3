import { UnsplashCurlService } from '@services/unsplash-curl.service';
import { Handler } from 'aws-lambda/handler';
import { log } from '@helper/logger';
import { errorHandler } from '@helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';
import { UnsplashManager } from './unsplash.manager';

export const getImagesUnsplash: Handler<APIGatewayLambdaEvent<null>, any> = async (event) => {
  log(event);

  try {
    const manager = new UnsplashManager();

    const { query } = event.query;

    const unsplashCurlService = new UnsplashCurlService();

    return await manager.getImagesList(query, unsplashCurlService);
  } catch (error) {
    return errorHandler(error);
  }
};
