import type { AWS } from '@serverless/typescript';
import { BucketConfig } from './config/serverless/buckets/image.bucket';
import { galleryConfig } from './config/serverless/parts/gallery/gallery';
import { authConfig } from './config/serverless/parts/auth/gallery-auth';
import { TableConfig } from './config/serverless/tables/users.table';
import { UnsplashApiConfig } from './config/serverless/parts/unsplash-api/unsplash-api';
import { updateImagesConfig } from './config/serverless/parts/gallery/update-images';
import { SubClipBucketConfig } from './config/serverless/buckets/sub-clip-images.bucket';
import { SQSConfig } from './config/serverless/sqs/upload-images-sqs';
import { joinParts } from './config/serverless/utils';

const masterConfig: AWS = {
  service: 'vstepanov-sls',
  configValidationMode: 'warn',
  variablesResolutionMode: '20210326',
  unresolvedVariablesNotificationMode: 'error',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: '${opt:stage, "dev"}',
    lambdaHashingVersion: '20201221',
    // @ts-ignore
    region: '${file(./env.yml):${self:provider.stage}.REGION}',
    profile: '${file(./env.yml):${self:provider.stage}.PROFILE}',
    environment: {
      STAGE: '${self:provider.stage}',
    },
    tags: {
      client: '${file(./env.yml):${self:provider.stage}.CLIENT}',
    },
    logs: {
      httpApi: true,
    },
    httpApi: {
      useProviderTags: true,
      payload: '2.0',
      cors: true,
    },
  },
  package: {
    individually: true,
    patterns: ['bin/*'],
  },
  custom: {
    webpack: {
      webpackConfig: 'webpack.config.js',
      includeModules: {
        forceExclude: ['aws-sdk'],
      },
      packagerOptions: {
        scripts: ['npm rebuild --arch=x64 --platform=linux sharp'],
      },
      concurrency: 5,
      serializedCompile: true,
      packager: 'npm',
    },
    prune: {
      automatic: true,
      number: 3,
    },
    envFiles: ['env.yml'],
    envEncryptionKeyId: {
      local: '${file(./kms_key.yml):local}',
      dev: '${file(./kms_key.yml):dev}',
      test: '${file(./kms_key.yml):test}',
      prod: '${file(./kms_key.yml):prod}',
    },
    // s3: {
    //   host: '0.0.0.0',
    //   port: 8001,
    //   directory: '/tmp',
    // },
    // capacities: [
    //   {
    //     table: 'UsersTable',
    //     read: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //     write: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //   },
    //   {
    //     table: 'JobsTable',
    //     index: ['ProducerIdGlobalIndex', 'CrewIdGlobalIndex'],
    //     read: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //     write: {
    //       minimum: 5,
    //       maximum: 100,
    //       usage: 0.75,
    //     },
    //   },
    // ],
    // 'serverless-offline-sns': {
    //   port: 4002,
    //   debug: false,
    // },
    // 'serverless-offline-sqs': {
    //   autoCreate: true,
    //   apiVersion: '2012-11-05',
    //   endpoint: 'http://0.0.0.0:9324',
    //   region: '${file(./env.yml):${self:provider.stage}.REGION}',
    //   accessKeyId: 'root',
    //   secretAccessKey: 'root',
    //   skipCacheInvalidation: false,
    // },
  },
  plugins: [
    '@redtea/serverless-env-generator',
    'serverless-webpack',
    // 'serverless-offline-sqs',
    'serverless-offline',
    // 'serverless-offline-sns',
    // 'serverless-s3-local',
    'serverless-prune-plugin',
  ],
};

module.exports = joinParts(masterConfig, [
  galleryConfig,
  authConfig,
  TableConfig,
  BucketConfig,
  UnsplashApiConfig,
  updateImagesConfig,
  SubClipBucketConfig,
  SQSConfig,
]);
