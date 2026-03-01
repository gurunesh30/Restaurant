import { Schema, model, Document } from "mongoose";

export type TableShape = "round" | "square";
export type TableStatus = "available" | "booked" | "unavailable";

export interface ITable extends Document {
  tableNumber: number;
  capacity: number;
  position: { x: number; y: number };
  shape: TableShape;
  floor: string;
  status: TableStatus;
  createdAt: Date;
  updatedAt: Date;
}

const tableSchema = new Schema<ITable>(
  {
    tableNumber: { type: Number, required: true, unique: true, min: 1 },
    capacity: { type: Number, required: true, min: 1 },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    shape: { type: String, enum: ["round", "square"], required: true },
    floor: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

export const Table = model<ITable>("Table", tableSchema);
export default Table;