import { Schema, model, Document, Types } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface IReservation extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableId: Types.ObjectId;
  userId?: Types.ObjectId;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Reservation = model<IReservation>("Reservation", reservationSchema);
export default Reservation;