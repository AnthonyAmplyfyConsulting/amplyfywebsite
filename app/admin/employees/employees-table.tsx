'use client';

import { useState } from 'react';
import { addEmployee, deleteEmployee } from '@/lib/actions';
import { Plus, Trash2, Shield, User } from 'lucide-react';
import { User as DBUser } from '@/lib/db';

export default function EmployeesTable({ users, currentUserId }: { users: DBUser[], currentUserId: string }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h1 className="text-3xl font-bold text-zinc-900">Employees</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-black/5"
                >
                    <Plus className="w-5 h-5" />
                    Add Employee
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/3">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/3">Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/6">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-1/6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                                            {user.role === 'Admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                        </div>
                                        {user.name}
                                        {user.id === currentUserId && <span className="text-xs text-zinc-400 font-normal">(You)</span>}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Admin'
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'bg-blue-50 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.id !== currentUserId && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Delete this employee?')) {
                                                        deleteEmployee(user.id);
                                                    }
                                                }}
                                                className="p-2 rounded-full text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-zinc-900">Add Employee</h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                            >
                                <Trash2 className="w-5 h-5 text-zinc-400 rotate-45" />
                            </button>
                        </div>

                        <form action={async (formData) => {
                            setLoading(true);
                            try {
                                await addEmployee(formData);
                                setIsAddModalOpen(false);
                            } catch (e) {
                                alert('Error adding employee');
                            }
                            setLoading(false);
                        }} className="space-y-4">

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Name</label>
                                <input name="name" placeholder="John Doe" required className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Email</label>
                                <input name="email" type="email" placeholder="john@example.com" required className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Password</label>
                                <input name="password" type="password" required className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Role</label>
                                <select name="role" className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all appearance-none">
                                    <option value="Cold Caller">Cold Caller</option>
                                    <option value="Admin">Admin</option>
                                </select>
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
                                    {loading ? 'Adding...' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
