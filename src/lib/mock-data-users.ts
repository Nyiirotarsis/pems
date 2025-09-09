import type { User } from "@/types";

// Extracted to avoid circular dependencies if other mocks need users.
export const USERS: User[] = [
    { id: 1, username: 'ceo', password: '123', role: 'CEO' },
    { id: 2, username: 'director', password: '123', role: 'Director' },
    { id: 3, username: 'financemanager', password: '123', role: 'Finance Manager' },
    { id: 4, username: 'hr', password: '123', role: 'HR/Admin' },
    { id: 5, username: 'it', password: '123', role: 'IT' },
    { id: 6, username: 'storemanager', password: '123', role: 'Store Manager' },
];
