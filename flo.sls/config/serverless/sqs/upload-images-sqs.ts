import { GetAtt, Ref, Sub } from '../cf-intristic-fn';
import { AWSPartitial } from '../types';

export const SQSConfig: AWSPartitial = {
  provider: {
    environment: {
      IMAGES_QUEUE_NAME: '${self:custom.sqsInfo.sqsName.${self:provider.stage}}',
      IMAGES_QUEUE_URL: '${self:custom.sqsInfo.sqsURL.${self:provider.stage}}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['SQS:*'],
            Resource: [GetAtt('imagesSQS.Arn')],
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      imagesSQS: {
        Type: 'AWS::SQS::Queue',
        DeletionPolicy: 'Retain',
        Properties: {
          QueueName: '${self:custom.sqsInfo.sqsName.${self:provider.stage}}',
          DelaySeconds: 60,
          VisibilityTimeout: 120,
        },
      },
    },
  },
  custom: {
    sqsInfo: {
      sqsName: {
        local: '${self:service}-local-images-sqs',
        dev: '${self:service}-dev-images-sqs',
        test: '${self:service}-test-images-sqs',
        prod: '${self:service}-prod-images-sqs',
      },
      sqsURL: {
        local: Sub('${file(env.yml):local.OFFLINE_API_BASE_URL}api/imagesSQS'),
        dev: Sub('https://${resourceName}.${region}.${suffix}/${accountId}/${path}', {
          resourceName: 'sqs',
          region: Ref('AWS::Region'),
          suffix: Ref('AWS::URLSuffix'),
          accountId: Ref('AWS::AccountId'),
          path: '${self:custom.sqsInfo.sqsName.${self:provider.stage}}',
        }),
        test: Sub('https://${resourceName}.${region}.${suffix}/${accountId}/${path}', {
          resourceName: 'sqs',
          region: Ref('AWS::Region'),
          suffix: Ref('AWS::URLSuffix'),
          accountId: Ref('AWS::AccountId'),
          path: '${self:custom.sqsInfo.sqsName.${self:provider.stage}}',
        }),
        prod: Sub('https://${resourceName}.${region}.${suffix}/${accountId}/${path}', {
          resourceName: 'sqs',
          region: Ref('AWS::Region'),
          suffix: Ref('AWS::URLSuffix'),
          accountId: Ref('AWS::AccountId'),
          path: '${self:custom.sqsInfo.sqsName.${self:provider.stage}}',
        }),
      },
    },
  },
};
// https://sqs.us-east-1.amazonaws.com/367315594041/imagesSQS
