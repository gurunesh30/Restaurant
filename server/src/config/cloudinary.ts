import { v2 as cloudinary } from 'cloudinary';
// Import the whole package as a default object first
import multerStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const { CloudinaryStorage } = multerStorage as any;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restaurant_assets',
    // In v4 + Cloudinary v2, use allowed_formats (underscore)
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    public_id: (_req: any, file: any) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

export default cloudinary;