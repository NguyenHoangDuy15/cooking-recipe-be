import { PutObjectCommand } from '@aws-sdk/client-s3';
import type { Request } from 'express';
import { s3Client } from '../config/s3';
import { config } from '../config/env';
import { prisma } from '../config/prisma';

/**
 * Processes an uploaded image file and saves its record to the database.
 * Depending on the configuration, it constructs a local URL or uploads the file to Cloudflare R2 and constructs a public URL.
 *
 * @param {Express.Multer.File} file - The file object provided by Multer middleware.
 * @param {Request} req - The Express request object, used to construct local URLs.
 * @returns {Promise<Object>} The newly created image database record containing the final URL.
 */
export const processAndSaveImage = async (file: Express.Multer.File, req: Request) => {
  let finalUrl = '';

  if (config.storageMode === 'local') {
    // In local mode, multer already saved it via diskStorage
    // We construct the local URL. Assumes server is running on req.protocol + host
    const host = req.get('host');
    finalUrl = `${req.protocol}://${host}/uploads/${file.filename}`;
  } else {
    // R2 mode: file is in memory (buffer)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.originalname;
    
    const command = new PutObjectCommand({
      Bucket: config.s3.bucketName,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
    
    // Construct public R2 URL
    // If a custom domain/r2.dev url is provided, use it
    if (config.s3.publicUrl) {
      finalUrl = `${config.s3.publicUrl}/${filename}`;
    } else {
      // Fallback (might not be public depending on bucket settings)
      finalUrl = `${config.s3.endpoint}/${config.s3.bucketName}/${filename}`;
    }
  }

  // Save to Database
  const imageRecord = await prisma.image.create({
    data: {
      url: finalUrl
    }
  });

  return imageRecord;
};
