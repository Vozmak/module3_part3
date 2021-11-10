import { AWSPartitial } from '../../types';

export const updateImagesConfig: AWSPartitial = {
  functions: {
    updateImages: {
      handler: 'api/update-images/handler.updateImages',
      memorySize: 128,
      events: [
        {
          s3: {
            bucket: '${file(env.yml):${self:provider.stage}.IMAGES_BUCKET_NAME}',
            event: 's3:ObjectCreated:*',
            // rules: [
            //   {
            //     prefix: 'strela996@bk.ru/',
            //   },
            // ],
            existing: true,
          },
        },
      ],
    },
  },
};
