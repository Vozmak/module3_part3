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
    uploadUnsplashImages: {
      handler: 'api/unsplash-api/handler.uploadUnsplashImages',
      memorySize: 128,
      events: [
        {
          sqs: {
            arn: 'arn:aws:sqs:us-east-1:367315594041:${self:service}-${self:provider.stage}-images-sqs',
          },
        },
      ],
    },
    sendMessageSQS: {
      handler: 'api/unsplash-api/handler.sendMessageSQS',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/gallery/unsplash',
            method: 'post',
            integration: 'lambda',
            cors: true,
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
