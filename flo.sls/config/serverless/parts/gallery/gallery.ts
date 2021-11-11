import { AWSPartitial } from '../../types';

export const galleryConfig: AWSPartitial = {
  functions: {
    getGallery: {
      handler: 'api/gallery/handler.getGallery',
      memorySize: 128,
      timeout: 10,
      events: [
        {
          http: {
            path: '/gallery',
            method: 'get',
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
    getPreSignedUrl: {
      handler: 'api/gallery/handler.getPreSignedUrl',
      memorySize: 128,
      events: [
        {
          http: {
            path: '/gallery/upload',
            method: 'POST',
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
              // identitySource: '${method.request.header.Authorization.slice(7)}',
              // claims: ['$context.authorizer.claims.user'],
              // scopes: ['user.email'],
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
