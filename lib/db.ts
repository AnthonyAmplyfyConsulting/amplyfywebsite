import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

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

// In-memory cache to reduce disk reads
let cache: DBData | null = null;

async function ensureDB() {
    const dir = path.dirname(DB_PATH);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }

    try {
        await fs.access(DB_PATH);
    } catch {
        // Create initial DB
        await fs.writeFile(DB_PATH, JSON.stringify({ leads: [], expenses: [], users: [] }, null, 2));
    }
}


export async function readDB(): Promise<DBData> {
    await ensureDB();
    if (cache) return cache;
    const data = await fs.readFile(DB_PATH, 'utf-8');
    cache = JSON.parse(data);
    return cache as DBData;
}

export async function writeDB(data: DBData) {
    await ensureDB();
    cache = data;
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Helper to add dummy data if empty (optional)
export async function seedDB() {
    const db = await readDB();
    if (db.leads.length === 0) {
        // db.leads.push({ ... });
        // await writeDB(db);
    }
}
