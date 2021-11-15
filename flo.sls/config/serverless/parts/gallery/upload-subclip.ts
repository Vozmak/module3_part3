import { AWSPartitial } from '../../types';

export const UploadSubClipConfig: AWSPartitial = {
  functions: {
    uploadSubClip: {
      handler: 'api/upload-subclip/handler.uploadSubClipImage',
      memorySize: 256,
      timeout: 10,
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
