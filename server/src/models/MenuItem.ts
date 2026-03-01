import { Schema, model, Document, Types } from "mongoose";

export interface CloudinaryImage {
    url: string;
    public_id: string;
}

export interface IMenuItem extends Document {
    name: string;
    description: string;
    price: number;
    category: Types.ObjectId;
    image: CloudinaryImage;
    isVeg: boolean;
    isTrending: boolean;
    rating: number;
    available: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        image: {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
        isVeg: { type: Boolean, required: true },
        isTrending: { type: Boolean, default: false },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        available: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const MenuItem = model<IMenuItem>("MenuItem", menuItemSchema);
export default MenuItem;
