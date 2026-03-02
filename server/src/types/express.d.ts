import { UserRole } from "./user.types.js";

declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
            role: UserRole;
        }
    }
}
