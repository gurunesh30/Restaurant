export type TableShape = "round" | "square";
export type TableStatus = "available" | "booked" | "unavailable";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  position: { x: number; y: number };
  shape: TableShape;
  status: TableStatus;
}

export interface Reservation {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableId: string | Table; // Can be ID or populated object
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateReservationDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableId: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}