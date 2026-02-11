'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readDB, writeDB, Lead, LeadStatus, Expense, ExpenseFrequency, User, UserRole } from './db';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

// --- Auth ---

const ADMIN_USER_EMAIL = 'anthony@amplyfyconsulting.com';
const ADMIN_PASS_DEFAULT = 'Flyfit_97$';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const db = await readDB();

    // --- Seed Logic: If no users, create default admin ---
    if (!db.users || db.users.length === 0) {
        if (email === ADMIN_USER_EMAIL && password === ADMIN_PASS_DEFAULT) {
            const newAdmin: User = {
                id: crypto.randomUUID(),
                name: 'Admin',
                email: ADMIN_USER_EMAIL,
                password: ADMIN_PASS_DEFAULT,
                role: 'Admin',
                createdAt: new Date().toISOString(),
            };
            if (!db.users) db.users = [];
            db.users.push(newAdmin);
            await writeDB(db);

            // Log them in immediately
            await setSession(newAdmin.id);
            redirect('/admin');
        }
    }

    // --- Ensure Bajram G exists (Migration/Seed) ---
    const bajramEmail = 'bajramg@amplyfyconsulting.com';
    if (db.users && !db.users.some(u => u.email.toLowerCase() === bajramEmail)) {
        const newBajram: User = {
            id: crypto.randomUUID(),
            name: 'Bajram G',
            email: bajramEmail,
            password: 'Bajramg12!',
            role: 'Admin',
            createdAt: new Date().toISOString(),
        };
        db.users.push(newBajram);
        await writeDB(db);
    }

    // --- Normal Login ---
    const user = db.users?.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
        await setSession(user.id);
        redirect('/admin');
    } else {
        return { error: 'Invalid credentials' };
    }
}

async function setSession(userId: string) {
    const cookieStore = await cookies();
    cookieStore.set('session_user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session_user_id');
    redirect('/login');
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;

    if (!userId) return null;

    const db = await readDB();
    const user = db.users?.find(u => u.id === userId);
    return user || null;
}

export async function checkAuth() {
    const user = await getCurrentUser();
    return !!user;
}

// --- Employees ---

// --- Employees ---

export async function addEmployee(formData: FormData) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as UserRole;

    try {
        const db = await readDB();
        if (!db.users) db.users = [];

        if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('User already exists');
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            name,
            email: email.toLowerCase(),
            password,
            role,
            createdAt: new Date().toISOString(),
        };

        db.users.push(newUser);
        await writeDB(db);
        revalidatePath('/admin/employees');
    } catch (error) {
        throw error;
    }
}

export async function deleteEmployee(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') throw new Error('Unauthorized');

    const db = await readDB();
    // Prevent deleting yourself
    if (currentUser.id === id) throw new Error('Cannot delete yourself');

    if (db.users) {
        db.users = db.users.filter(u => u.id !== id);
        await writeDB(db);
        revalidatePath('/admin/employees');
    }
}

// --- Leads ---

export async function addLead(data: Omit<Lead, 'id' | 'createdAt' | 'called'>) {
    const isAuth = await checkAuth();
    if (!isAuth) throw new Error('Unauthorized');

    const db = await readDB();
    const newLead: Lead = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        called: false,
    };
    db.leads.push(newLead);
    await writeDB(db);
    revalidatePath('/admin');
    revalidatePath('/admin/leads');
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
    const isAuth = await checkAuth();
    if (!isAuth) throw new Error('Unauthorized');

    const db = await readDB();
    const lead = db.leads.find((l) => l.id === id);
    if (lead) {
        lead.status = status;
        await writeDB(db);
        revalidatePath('/admin');
        revalidatePath('/admin/leads');
    }
}

export async function toggleLeadCalled(id: string) {
    const isAuth = await checkAuth();
    if (!isAuth) throw new Error('Unauthorized');

    const db = await readDB();
    const lead = db.leads.find((l) => l.id === id);
    if (lead) {
        lead.called = !lead.called;
        await writeDB(db);
        revalidatePath('/admin/leads');
    }
}

export async function deleteLead(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') throw new Error('Unauthorized');

    const db = await readDB();
    db.leads = db.leads.filter((l) => l.id !== id);
    await writeDB(db);
    revalidatePath('/admin');
    revalidatePath('/admin/leads');
}
// --- Expenses ---

export async function addExpense(formData: FormData) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') throw new Error('Unauthorized');

    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const frequency = formData.get('frequency') as ExpenseFrequency;
    const receiptFile = formData.get('receipt') as File | null;

    let receiptPath: string | undefined;

    if (receiptFile && receiptFile.size > 0) {
        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
        try {
            await fs.access(uploadsDir);
        } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${receiptFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadsDir, fileName);

        const arrayBuffer = await receiptFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await fs.writeFile(filePath, buffer);
        receiptPath = `/uploads/receipts/${fileName}`;
    }

    const db = await readDB();
    if (!db.expenses) db.expenses = []; // Handle migration for existing DB

    const newExpense: Expense = {
        id: crypto.randomUUID(),
        description,
        category,
        amount,
        frequency,
        receiptPath,
        createdAt: new Date().toISOString(),
    };
    db.expenses.push(newExpense);
    await writeDB(db);
    revalidatePath('/admin');
    revalidatePath('/admin/expenses');
}

export async function deleteExpense(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') throw new Error('Unauthorized');

    const db = await readDB();
    if (db.expenses) {
        db.expenses = db.expenses.filter((e) => e.id !== id);
        await writeDB(db);
        revalidatePath('/admin');
        revalidatePath('/admin/expenses');
    }
}
