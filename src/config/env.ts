import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  storageMode: process.env.STORAGE_MODE || 'local', // 'local' or 'r2'
  s3: {
    endpoint: process.env.S3_ENDPOINT || '',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    bucketName: process.env.S3_BUCKET_NAME || '',
    publicUrl: process.env.S3_PUBLIC_URL || '',
  }
};
