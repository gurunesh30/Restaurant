import { v2 as cloudinary } from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'restaurant_assets',
  allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
  filename: function (_req: any, file: any, cb: any) {
    cb(undefined, `${Date.now()}-${file.originalname.split('.')[0]}`);
  }
});

export default cloudinary;