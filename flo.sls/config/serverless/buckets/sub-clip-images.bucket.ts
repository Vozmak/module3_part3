import { AWSPartitial } from '../types';

export const SubClipBucketConfig: AWSPartitial = {
  provider: {
    environment: {
      SUB_CLIP_IMAGES_BUCKET_NAME: '${self:custom.bucketsNames.SubClipImageBucket.${self:provider.stage}}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              's3:CreateBucket',
              's3:ListBuckets',
              's3:GetBucketCors',
              's3:GetBucket',
              's3:GetObject',
              's3:GetObjectAcl',
              's3:PutObject',
              's3:PutObjectAcl',
            ],
            Resource: [
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.SUB_CLIP_IMAGES_BUCKET_NAME}',
              'arn:aws:s3:::${file(env.yml):${self:provider.stage}.SUB_CLIP_IMAGES_BUCKET_NAME}/*',
            ],
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      subClipImagesBucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Retain',
        Properties: {
          AccessControl: 'PublicReadWrite',
          BucketName: '${file(env.yml):${self:provider.stage}.SUB_CLIP_IMAGES_BUCKET_NAME}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'HEAD', 'POST', 'DELETE'],
                AllowedOrigins: ['*'],
              },
            ],
          },
        },
      },
    },
  },
  custom: {
    bucketsNames: {
      SubClipImageBucket: {
        local: '${self:service}-local-gallery-sub-clip-s3',
        dev: '${self:service}-dev-gallery-sub-clip-s3',
        test: '${self:service}-test-gallery-sub-clip-s3',
        prod: '${self:service}-prod-gallery-sub-clip-s3',
      },
    },
  },
};
