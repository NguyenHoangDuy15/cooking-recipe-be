import { S3Client } from '@aws-sdk/client-s3';
import { config } from './env';

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: config.s3.endpoint,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
});
