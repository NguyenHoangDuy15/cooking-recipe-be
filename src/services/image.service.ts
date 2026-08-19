import type { Request } from 'express';
import { prisma } from '../config/prisma';

/**
 * Processes an uploaded image file and saves its record to the database.
 * It constructs a local URL to the file which is saved in the Fly.io persistent volume.
 *
 * @param {Express.Multer.File} file - The file object provided by Multer middleware.
 * @param {Request} req - The Express request object, used to construct local URLs.
 * @returns {Promise<Object>} The newly created image database record containing the final URL.
 */
export const processAndSaveImage = async (file: Express.Multer.File, req: Request) => {
  // In local mode, multer already saved it via diskStorage
  // We construct the local URL. Assumes server is running on req.protocol + host
  const host = req.get('host');
  // Handle Fly.io SSL termination (req.protocol might be http even if accessed via https)
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const finalUrl = `${protocol}://${host}/uploads/${file.filename}`;

  // Save to Database
  const imageRecord = await prisma.image.create({
    data: {
      url: finalUrl
    }
  });

  return imageRecord;
};
