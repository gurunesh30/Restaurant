declare module 'multer-storage-cloudinary' {
    import { StorageEngine } from 'multer';
    import { v2 as cloudinary } from 'cloudinary';

    export interface CloudinaryStorageOptions {
        cloudinary: typeof cloudinary;
        folder?: string | ((req: any, file: any, cb: any) => void);
        allowedFormats?: string[] | ((req: any, file: any, cb: any) => void);
        filename?: (req: any, file: any, cb: any) => void;
        params?: any;
        transformation?: any;
        type?: string;
        format?: string;
    }

    function cloudinaryStorage(options: CloudinaryStorageOptions): StorageEngine;
    export = cloudinaryStorage;
}