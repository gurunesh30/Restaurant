import { Schema, model, Document } from "mongoose";

export type TableShape = "circle" | "square" | "rectangle";
export type TableStatus = "available" | "booked" | "unavailable";
export type TableSection = "Ground" | "Lounge" | "patio";

export interface ITable extends Document {
  tableNumber: number;
  label: string;          // e.g. "G-01", "L-05", "R-12"
  capacity: number;
  shape: TableShape;
  section: TableSection;  // "Ground" | "Lounge" | "patio"
  floor: number;          // 1 | 2 | 3
  status: TableStatus;
  createdAt: Date;
  updatedAt: Date;
}

const tableSchema = new Schema<ITable>(
  {
    tableNumber: { type: Number, required: true, unique: true, min: 1 },
    label: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    shape: {
      type: String,
      enum: ["circle", "square", "rectangle"],
      required: true,
    },
    section: {
      type: String,
      enum: ["Ground", "Lounge", "patio"],
      required: true,
    },
    floor: { type: Number, required: true, enum: [1, 2, 3] },
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