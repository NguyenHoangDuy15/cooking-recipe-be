import type { Request, Response } from 'express';
import { processAndSaveImage } from '../services/image.service';

/**
 * Controller to handle independent image uploads.
 * Expects 'multipart/form-data' with an 'image' field.
 * Responds with the created image record (including ID and URL).
 * 
 * @param {Request} req - The Express request object containing the uploaded file.
 * @param {Response} res - The Express response object.
 */
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const imageRecord = await processAndSaveImage(req.file, req);
    res.status(201).json(imageRecord);
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};
