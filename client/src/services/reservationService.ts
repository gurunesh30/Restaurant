import api from './api';

/* ─────────────────────────────────────────────────────────
   TYPES (mirroring the backend models)
 ───────────────────────────────────────────────────────── */
export type TableShape = 'circle' | 'square' | 'rectangle';
export type TableStatus = 'available' | 'booked' | 'unavailable';
export type TableSection = 'Ground' | 'Lounge' | 'patio';

export interface ApiTable {
    _id: string;
    tableNumber: number;
    label: string;
    capacity: number;
    shape: TableShape;
    section: TableSection;
    floor: number;        // 1 | 2 | 3
    status: TableStatus;
}

export interface CreateReservationPayload {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    tableId: string;      // MongoDB _id of the table
    date: string;         // YYYY-MM-DD
    time: string;         // e.g. "7:30 PM"
    guests: number;
    notes?: string;
}

export interface ApiReservation {
    _id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    tableId: ApiTable | string;
    date: string;
    time: string;
    guests: number;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
}

/* ─────────────────────────────────────────────────────────
   API CALLS
 ───────────────────────────────────────────────────────── */

/**
 * Fetch all tables with real-time availability overlay.
 * Pass date + time to get per-slot availability; omit for base layout.
 */
export const fetchTables = async (date?: string, time?: string): Promise<ApiTable[]> => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (time) params.time = time;

    const response = await api.get('/reservations/tables', { params });
    return response.data.data as ApiTable[];
};

/**
 * Create a new reservation. Returns the created reservation object.
 */
export const createReservation = async (payload: CreateReservationPayload): Promise<ApiReservation> => {
    const response = await api.post('/reservations', payload);
    return response.data.data as ApiReservation;
};

/**
 * Fetch the currently logged-in user's reservations.
 */
export const getMyReservations = async (): Promise<ApiReservation[]> => {
    const response = await api.get('/reservations/my');
    return response.data.data as ApiReservation[];
};

/**
 * Cancel a reservation by ID (user must own it).
 */
export const cancelReservation = async (id: string): Promise<void> => {
    await api.delete(`/reservations/${id}`);
};
