
'use client';

import { useState } from 'react';
import { addExpense, deleteExpense } from '@/lib/actions';
import { Plus, Trash2, Paperclip, ExternalLink } from 'lucide-react';
import { Expense } from '@/lib/db';

export default function ExpensesTable({ expenses }: { expenses: Expense[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Calculate totals
    const totalMonthly = expenses
        .filter(e => e.frequency === 'Monthly')
        .reduce((sum, e) => sum + e.amount, 0);

    const totalYearly = expenses
        .filter(e => e.frequency === 'Yearly')
        .reduce((sum, e) => sum + e.amount, 0);

    const totalOneTime = expenses
        .filter(e => e.frequency === 'One-time')
        .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h1 className="text-3xl font-bold text-zinc-900">Expenses</h1>

                {/* Stats Header */}
                <div className="flex gap-4 flex-wrap">
                    <div className="px-6 py-3 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                        <div className="text-red-600 font-bold text-lg">${totalMonthly.toLocaleString()}</div>
                        <div className="text-red-400 text-xs font-medium uppercase tracking-wider">/ Month</div>
                    </div>
                    <div className="px-6 py-3 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                        <div className="text-red-600 font-bold text-lg">${totalYearly.toLocaleString()}</div>
                        <div className="text-red-400 text-xs font-medium uppercase tracking-wider">/ Year</div>
                    </div>
                    <div className="px-6 py-3 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                        <div className="text-red-600 font-bold text-lg">${totalOneTime.toLocaleString()}</div>
                        <div className="text-red-400 text-xs font-medium uppercase tracking-wider">One-Time</div>
                    </div>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-black/5"
                >
                    <Plus className="w-5 h-5" />
                    Add Expense
                </button>
            </div>

            {/* Expenses Table (Sheets Style) */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/4">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/4">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/6">Frequency</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/12 text-center">Receipt</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/6 text-right">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                                        No expenses recorded.
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense) => (
                                    <tr key={expense.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-zinc-900">{expense.description}</td>
                                        <td className="px-6 py-4 text-zinc-600">{expense.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expense.frequency === 'Monthly'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : expense.frequency === 'Yearly'
                                                        ? 'bg-purple-50 text-purple-700'
                                                        : 'bg-zinc-100 text-zinc-700'
                                                }`}>
                                                {expense.frequency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {expense.receiptPath && (
                                                <a
                                                    href={expense.receiptPath}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-[#ff5500] hover:bg-orange-50 rounded-full transition-colors"
                                                    title="View Receipt"
                                                >
                                                    <Paperclip className="w-4 h-4" />
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-medium text-zinc-900">
                                            ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Delete this expense?')) {
                                                        deleteExpense(expense.id);
                                                    }
                                                }}
                                                className="p-2 rounded-full text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Expense Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-zinc-900">New Expense</h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                            >
                                <Trash2 className="w-5 h-5 text-zinc-400 rotate-45" />
                            </button>
                        </div>

                        <form action={async (formData) => {
                            setLoading(true);
                            await addExpense(formData);
                            setLoading(false);
                            setIsAddModalOpen(false);
                        }} className="space-y-4">

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Description</label>
                                <input name="description" placeholder="e.g. Hosting Fees" required className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Amount ($)</label>
                                    <input name="amount" type="number" step="0.01" required className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Frequency</label>
                                    <select name="frequency" className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all appearance-none">
                                        <option value="One-time">One-time</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Used For (Category)</label>
                                <input name="category" placeholder="e.g. Software, Marketing" required className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Receipt (Optional)</label>
                                <input name="receipt" type="file" accept="image/*,.pdf" className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200" />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 bg-zinc-100 text-zinc-600 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
