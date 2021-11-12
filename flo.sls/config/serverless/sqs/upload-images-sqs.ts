import { AWSPartitial } from '../types';

export const SQSConfig: AWSPartitial = {
  provider: {
    environment: {},
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['SQS:*'],
            Resource: ['arn:aws:sqs:*:*:${file(env.yml):${self:provider.stage}.IMAGES_QUEUE_NAME}'],
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
          QueueName: '${file(env.yml):${self:provider.stage}.IMAGES_QUEUE_NAME}',
          DelaySeconds: 60,
          VisibilityTimeout: 120,
        },
      },
    },
  },
};
