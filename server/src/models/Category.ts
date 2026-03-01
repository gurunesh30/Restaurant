import { Schema, model, Document } from "mongoose";

export interface CloudinaryImage {
    url: string;
    public_id: string;
}

export interface ICategory extends Document {
    name: string;
    slug: string;
    image?: CloudinaryImage;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        image: {
           type: {
               url: { type: String, required: true },
                public_id: { type: String, required: true },
            },
            required: false,
            _id: false,
        },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);
export default Category;
