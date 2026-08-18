import multer from 'multer';
import { config } from '../config/env';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure local uploads directory exists
const localUploadsDir = path.join(__dirname, '../../public/uploads');
if (config.storageMode === 'local' && !fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

const storage = config.storageMode === 'local'
  ? multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, localUploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    })
  : multer.memoryStorage(); // For R2 upload, keep in memory

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
