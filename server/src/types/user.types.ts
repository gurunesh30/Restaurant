export type UserRole = "user" | "admin";

export interface User {
    _id: string;
    name: string;
    email: string;
    picture: string;
    role: UserRole;
    createdAt: string;
}
