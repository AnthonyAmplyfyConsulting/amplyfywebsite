
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// --- Configuration ---
// Manually set URI here if running script directly, or use dotenv
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// --- Schemas (Copied from lib/models.ts to avoid TS compilation issues in simple script) ---
const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Cold Caller'], default: 'Cold Caller' },
    createdAt: { type: String, default: () => new Date().toISOString() },
});

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

const ExpenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: ['Monthly', 'One-time', 'Yearly'], required: true },
    receiptPath: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

// --- Migration Logic ---

async function migrate() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    if (!fs.existsSync(dbPath)) {
        console.error('db.json not found!');
        process.exit(1);
    }

    const rawData = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Users
    console.log(`Migrating ${data.users?.length || 0} users...`);
    if (data.users) {
        for (const user of data.users) {
            const exists = await User.findOne({ email: user.email });
            if (!exists) {
                await User.create(user);
                console.log(`Verified/Added user: ${user.email}`);
            } else {
                console.log(`Skipped existing user: ${user.email}`);
            }
        }
    }

    // Leads
    console.log(`Migrating ${data.leads?.length || 0} leads...`);
    if (data.leads) {
        for (const lead of data.leads) {
            const exists = await Lead.findOne({ id: lead.id });
            if (!exists) {
                await Lead.create(lead);
                console.log(`Added lead: ${lead.businessName}`);
            }
        }
    }

    // Expenses
    console.log(`Migrating ${data.expenses?.length || 0} expenses...`);
    if (data.expenses) {
        for (const expense of data.expenses) {
            const exists = await Expense.findOne({ id: expense.id });
            if (!exists) {
                await Expense.create(expense);
                console.log(`Added expense: ${expense.description}`);
            }
        }
    }

    console.log('Migration complete.');
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
