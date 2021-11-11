import { UnsplashCurlService } from '@services/unsplash-curl.service';
import { Handler } from 'aws-lambda/handler';
import { log } from '@helper/logger';
import { errorHandler } from '@helper/rest-api/error-handler';
import { APIGatewayLambdaEvent } from '@interfaces/api-gateway-lambda.interface';
import { ImagesList, UploadBodyImages } from './unsplash.interface';
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

export const uploadUnsplashImages: Handler<APIGatewayLambdaEvent<UploadBodyImages>, string> = async (event) => {
  log(event);

  try {
    const manager = new UnsplashManager();

    const { urls } = event.body;
    const { context: email } = event.enhancedAuthContext;
    const unsplashCurlService = new UnsplashCurlService();

    return manager.uploadUnsplashImages(urls, email, unsplashCurlService);
  } catch (error) {
    return errorHandler(error);
  }
};
