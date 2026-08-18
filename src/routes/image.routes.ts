import { Router } from 'express';
import { uploadImage } from '../controllers/image.controller';
import { upload } from '../middlewares/upload';

const router = Router();

// Endpoint for uploading an image separately
router.post('/upload', upload.single('image'), uploadImage);

export default router;
