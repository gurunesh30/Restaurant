import mongoose, { Schema, Document } from 'mongoose';

export type ContactPurpose =
    | 'general'
    | 'reservation'
    | 'feedback'
    | 'complaint'
    | 'catering'
    | 'other';

export interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    purpose: ContactPurpose;
    message: string;
    read: boolean;
    createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
    {
        name: { type: String, required: true, trim: true, maxlength: 100 },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        purpose: {
            type: String,
            enum: ['general', 'reservation', 'feedback', 'complaint', 'catering', 'other'],
            default: 'general',
        },
        message: { type: String, required: true, trim: true, maxlength: 1000 },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<IContact>('Contact', ContactSchema);
