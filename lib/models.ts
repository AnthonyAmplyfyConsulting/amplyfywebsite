import mongoose from 'mongoose';

// --- Users ---

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping UUID for now
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Cold Caller'], default: 'Cold Caller' },
    createdAt: { type: String, default: () => new Date().toISOString() },
});

// Prevent overwriting model if already compiled
export const User = mongoose.models.User || mongoose.model('User', UserSchema);


// --- Leads ---

const LeadSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['Hot', 'Warm', 'Cold'], default: 'Cold' },
    called: { type: Boolean, default: false },
    source: { type: String },
    placeId: { type: String },
    website: { type: String },
    address: { type: String },
    rating: { type: Number },
    reviewCount: { type: Number },
    priceLevel: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);


// --- Expenses ---

const ExpenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: ['Monthly', 'One-time', 'Yearly'], required: true },
    receiptPath: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
});

export const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
