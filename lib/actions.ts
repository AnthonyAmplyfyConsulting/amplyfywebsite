'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dbConnect from './mongodb';
import { User, Lead, Expense } from './models';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { UserRole, LeadStatus, ExpenseFrequency } from './db';

// --- Auth ---

const ADMIN_USER_EMAIL = 'anthony@amplyfyconsulting.com';
const ADMIN_PASS_DEFAULT = 'Flyfit_97$';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await dbConnect();

    // --- Seed Logic: If no users, create default admin ---
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        if (email === ADMIN_USER_EMAIL && password === ADMIN_PASS_DEFAULT) {
            const newAdmin = await User.create({
                id: crypto.randomUUID(),
                name: 'Admin',
                email: ADMIN_USER_EMAIL,
                password: ADMIN_PASS_DEFAULT,
                role: 'Admin',
            });

            // Log them in immediately
            await setSession(newAdmin.id);
            redirect('/admin');
        }
    }

    // --- Ensure Bajram G exists (Migration/Seed) ---
    const bajramEmail = 'bajramg@amplyfyconsulting.com';
    const existingBajram = await User.findOne({ email: { $regex: new RegExp(`^${bajramEmail}$`, 'i') } });
    if (!existingBajram) {
        await User.create({
            id: crypto.randomUUID(),
            name: 'Bajram G',
            email: bajramEmail,
            password: 'Bajramg12!',
            role: 'Admin',
        });
    }

    // --- Normal Login ---
    // Note: In a real app, verify password hash. Here we use plaintext as per existing code.
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') }, password: password });

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

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;

    if (!userId) return null;

    await dbConnect();
    const user = await User.findOne({ id: userId }).lean();
    return user || null;
}

export async function checkAuth() {
    const user = await getCurrentUser();
    return !!user;
}

// --- Employees ---

export async function addEmployee(formData: FormData) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') throw new Error('Unauthorized');

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as UserRole;

    await dbConnect();

    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    await User.create({
        id: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
        password,
        role,
    });

    revalidatePath('/admin/employees');
}

export async function deleteEmployee(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') throw new Error('Unauthorized');

    // Prevent deleting yourself
    if (currentUser.id === id) throw new Error('Cannot delete yourself');

    await dbConnect();
    await User.deleteOne({ id });
    revalidatePath('/admin/employees');
}

// --- Leads ---

export async function addLead(data: any) {
    const isAuth = await checkAuth();
    if (!isAuth) throw new Error('Unauthorized');

    await dbConnect();
    await Lead.create({
        ...data,
        id: crypto.randomUUID(),
    });

    revalidatePath('/admin');
    revalidatePath('/admin/leads');
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
    const isAuth = await checkAuth();
    if (!isAuth) throw new Error('Unauthorized');

    await dbConnect();
    await Lead.updateOne({ id }, { status });

    revalidatePath('/admin');
    revalidatePath('/admin/leads');
}

export async function toggleLeadCalled(id: string) {
    const isAuth = await checkAuth();
    if (!isAuth) throw new Error('Unauthorized');

    await dbConnect();
    const lead = await Lead.findOne({ id });
    if (lead) {
        lead.called = !lead.called;
        await lead.save();
        revalidatePath('/admin/leads');
    }
}

export async function deleteLead(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') throw new Error('Unauthorized');

    await dbConnect();
    await Lead.deleteOne({ id });

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

    await dbConnect();
    await Expense.create({
        id: crypto.randomUUID(),
        description,
        category,
        amount,
        frequency,
        receiptPath,
    });

    revalidatePath('/admin');
    revalidatePath('/admin/expenses');
}

export async function deleteExpense(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'Admin') throw new Error('Unauthorized');

    await dbConnect();
    await Expense.deleteOne({ id });

    revalidatePath('/admin');
    revalidatePath('/admin/expenses');
}
