'use client';

import { useState } from 'react';
import { addLead, updateLeadStatus, toggleLeadCalled, deleteLead } from '@/lib/actions';
import { Plus, Phone, Search, Trash2, CheckCircle2 } from 'lucide-react';
import { Lead } from '@/lib/db';
import { useRouter } from 'next/navigation';

// Server Component Wrapper (Alternative: passing data from page.tsx)
// For simplicity in this structure, I'll make this a client component that accepts initial data
// But ideally, we fetch in a server component page.tsx and pass to a client component.
// Let's modify the plan: page.tsx (Server) -> LeadsTable (Client)

export default function LeadsPage({ leads }: { leads: Lead[] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'All' | 'Hot' | 'Warm' | 'Cold'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLeads = leads.filter(lead => {
        const matchesTab = activeTab === 'All' || lead.status === activeTab;
        const matchesSearch = lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-zinc-900">Leads</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#ff5500] text-white font-bold rounded-xl hover:bg-[#ff4400] transition-colors shadow-lg shadow-orange-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Add New Lead
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-zinc-200">
                <div className="flex items-center gap-1 p-1 bg-zinc-100/50 rounded-xl w-full md:w-auto">
                    {(['All', 'Hot', 'Warm', 'Cold'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                    ? 'bg-white text-zinc-900 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-zinc-900 placeholder:text-zinc-400"
                    />
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Business</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                                        No leads found.
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border-none outline-none appearance-none cursor-pointer ${lead.status === 'Hot' ? 'bg-red-100 text-red-700' :
                                                            lead.status === 'Warm' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-blue-100 text-blue-700'
                                                        }`}
                                                >
                                                    <option value="Hot">Hot</option>
                                                    <option value="Warm">Warm</option>
                                                    <option value="Cold">Cold</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-zinc-900">{lead.businessName}</div>
                                            <div className="text-xs text-zinc-500">{lead.notes}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-zinc-700">{lead.name}</div>
                                            <div className="text-sm text-zinc-500">{lead.email}</div>
                                            <div className="text-xs text-zinc-400">{lead.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleLeadCalled(lead.id)}
                                                    className={`p-2 rounded-full transition-colors ${lead.called
                                                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                            : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                                                        }`}
                                                    title={lead.called ? "Called" : "Mark as Called"}
                                                >
                                                    {lead.called ? <CheckCircle2 className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this lead?')) {
                                                            deleteLead(lead.id);
                                                        }
                                                    }}
                                                    className="p-2 rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-zinc-900">Add New Lead</h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                            >
                                <Trash2 className="w-5 h-5 text-zinc-400 rotate-45" /> {/* Using Trash2 rotated as X for now, or import X */}
                            </button>
                        </div>

                        <form action={async (formData) => {
                            await addLead({
                                businessName: formData.get('businessName') as string,
                                name: formData.get('name') as string,
                                email: formData.get('email') as string,
                                phone: formData.get('phone') as string,
                                notes: formData.get('notes') as string,
                                status: formData.get('status') as any,
                            });
                            setIsAddModalOpen(false);
                        }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Business Name</label>
                                    <input name="businessName" required className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-[#ff9900] outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Contact Name</label>
                                    <input name="name" required className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-[#ff9900] outline-none transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Email</label>
                                    <input name="email" type="email" required className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-[#ff9900] outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Phone</label>
                                    <input name="phone" type="tel" className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-[#ff9900] outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Status</label>
                                <select name="status" className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-[#ff9900] outline-none transition-all appearance-none">
                                    <option value="Cold">Cold</option>
                                    <option value="Warm">Warm</option>
                                    <option value="Hot">Hot</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1 uppercase">Notes</label>
                                <textarea name="notes" rows={3} className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-[#ff9900] outline-none transition-all resize-none"></textarea>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 bg-zinc-100 text-zinc-600 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                                >
                                    Save Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
