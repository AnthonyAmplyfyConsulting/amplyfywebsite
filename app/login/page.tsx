'use client';

import { login } from '@/lib/actions';
import { useState } from 'react';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        const res = await login(formData);
        if (res?.error) {
            setError(res.error);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
            <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-zinc-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">Amplyfy Admin</h1>
                    <p className="text-zinc-500">Sign in to access your CRM</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center font-medium">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20 outline-none transition-all"
                            placeholder="admin@amplyfy.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/20 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
