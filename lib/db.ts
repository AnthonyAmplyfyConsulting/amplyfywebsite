// This file now only serves as a Type definition file and is kept for compatibility.
// The actual data storage has moved to MongoDB (lib/models.ts and lib/mongodb.ts).

export type LeadStatus = 'Hot' | 'Warm' | 'Cold';

export type UserRole = 'Admin' | 'Cold Caller';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // Plaintext for MVP as requested
    role: UserRole;
    createdAt: string;
}

export interface Lead {
    id: string;
    businessName: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
    status: LeadStatus;
    called: boolean;
    createdAt: string;
}

export type ExpenseFrequency = 'Monthly' | 'One-time' | 'Yearly';

export interface Expense {
    id: string;
    amount: number;
    frequency: ExpenseFrequency;
    category: string; // "What it was used for"
    description: string;
    receiptPath?: string;
    createdAt: string;
}

export interface DBData {
    leads: Lead[];
    expenses: Expense[];
    users: User[];
}
