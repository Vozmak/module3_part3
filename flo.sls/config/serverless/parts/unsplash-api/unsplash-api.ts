import { AWSPartitial } from '../../types';

export const UnsplashApiConfig: AWSPartitial = {
  functions: {
    getImagesUnsplash: {
      handler: 'api/unsplash-api/handler.getImagesUnsplash',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/gallery/unsplash',
            method: 'get',
            integration: 'lambda',
            cors: true,
            request: {
              method: 'GET',
              parameters: {
                querystrings: {
                  query: true,
                },
              },
            },
            response: {
              headers: {
                'Access-Control-Allow-Origin': "'*'",
                'Content-Type': "'application/json'",
              },
              template: "$input.json('$')",
            },
            authorizer: {
              name: 'GalleryAuthorizerRestApi',
            },
          },
        },
      ],
    },
    GalleryAuthorizerRestApi: {
      handler: 'api/auth/handler.authentication',
      memorySize: 128,
    },
  },
};
