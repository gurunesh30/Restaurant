import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "user" | "admin";

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  picture?: string;
  role: UserRole;
  provider: "local" | "google";
  // ── Optional profile fields ──────────────────────
  phone?: string;
  bio?: string;
  dateOfBirth?: Date;
  address?: IAddress;
  // ─────────────────────────────────────────────────
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    picture: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    // ── Optional profile ──────────────────────────
    phone: { type: String },
    bio: { type: String },
    dateOfBirth: { type: Date },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
  },
  { timestamps: true }
);

// Hash password before saving (Mongoose v8+: async = no next callback)
userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>("User", userSchema);
export default User;