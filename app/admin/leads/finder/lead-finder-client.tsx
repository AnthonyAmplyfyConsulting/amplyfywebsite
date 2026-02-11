'use client';

import { useState } from 'react';
import { bulkApproveLeads } from '@/lib/actions';
import { Lead } from '@/lib/db';
import { Search, Loader2, CheckCircle2, XCircle, Globe, Phone, MapPin, Star } from 'lucide-react';

interface FindLeadsResult {
    leads: Partial<Lead>[];
    totalFound: number;
    filtered: number;
}

export default function LeadFinderClient() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<FindLeadsResult | null>(null);
    const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
    const [approving, setApproving] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setResults(null);
        setSelectedLeads(new Set());

        try {
            const response = await fetch('/api/find-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                throw new Error('Failed to find leads');
            }

            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error finding leads:', error);
            alert('Error finding leads. Please check your API key configuration.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLead = (index: number) => {
        const newSelected = new Set(selectedLeads);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedLeads(newSelected);
    };

    const toggleAll = () => {
        if (selectedLeads.size === results?.leads.length) {
            setSelectedLeads(new Set());
        } else {
            setSelectedLeads(new Set(results?.leads.map((_, i) => i) || []));
        }
    };

    const handleApprove = async () => {
        if (!results || selectedLeads.size === 0) return;

        setApproving(true);
        try {
            const leadsToAdd = Array.from(selectedLeads).map(i => results.leads[i]) as Omit<Lead, 'id' | 'createdAt' | 'called'>[];
            const result = await bulkApproveLeads(leadsToAdd);

            alert(`Successfully added ${result.added} leads! ${result.skipped > 0 ? `Skipped ${result.skipped} duplicates.` : ''}`);

            // Clear results after approval
            setResults(null);
            setSelectedLeads(new Set());
            setQuery('');
        } catch (error) {
            console.error('Error approving leads:', error);
            alert('Error adding leads. Please try again.');
        } finally {
            setApproving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-zinc-900">Lead Finder</h1>
                <p className="text-zinc-600">
                    Find qualified SMB leads using Google Places. Searches filter for businesses with phone numbers, websites, and 50-500 reviews.
                </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">
                            Search Query
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder='e.g., "dental offices in Miami FL" or "real estate agencies in Austin TX"'
                                className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-[#ff9900] outline-none transition-all"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !query.trim()}
                                className="flex items-center gap-2 px-6 py-3 bg-[#ff5500] text-white font-bold rounded-xl hover:bg-[#ff4400] transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Find Leads
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                        <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Example Searches</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                'dental offices in Los Angeles CA',
                                'real estate agencies in Miami FL',
                                'insurance agencies in Chicago IL',
                                'accounting firms in Houston TX',
                                'law offices in New York NY'
                            ].map((example) => (
                                <button
                                    key={example}
                                    type="button"
                                    onClick={() => setQuery(example)}
                                    className="px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-600 hover:border-[#ff9900] hover:text-[#ff9900] transition-colors"
                                    disabled={isLoading}
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </form>

            {/* Results */}
            {results && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-zinc-600">
                            Found <span className="font-bold text-zinc-900">{results.totalFound}</span> businesses,
                            filtered to <span className="font-bold text-[#ff5500]">{results.filtered}</span> qualified leads
                        </div>
                        {results.leads.length > 0 && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleAll}
                                    className="text-sm text-zinc-600 hover:text-[#ff5500] font-medium"
                                >
                                    {selectedLeads.size === results.leads.length ? 'Deselect All' : 'Select All'}
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={selectedLeads.size === 0 || approving}
                                    className="flex items-center gap-2 px-6 py-2 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {approving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approve {selectedLeads.size > 0 && `(${selectedLeads.size})`}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {results.leads.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center">
                            <XCircle className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                            <p className="text-zinc-600">No qualified leads found. Try a different search query or location.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-zinc-50 border-b border-zinc-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLeads.size === results.leads.length}
                                                    onChange={toggleAll}
                                                    className="w-4 h-4 rounded border-zinc-300 text-[#ff5500] focus:ring-[#ff5500]"
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-left">Business</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-left">Contact</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-left">Quality</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {results.leads.map((lead, index) => (
                                            <tr
                                                key={index}
                                                className={`hover:bg-zinc-50/50 transition-colors ${selectedLeads.has(index) ? 'bg-orange-50/30' : ''}`}
                                            >
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLeads.has(index)}
                                                        onChange={() => toggleLead(index)}
                                                        className="w-4 h-4 rounded border-zinc-300 text-[#ff5500] focus:ring-[#ff5500]"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-zinc-900">{lead.businessName}</div>
                                                    <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {lead.address?.split(',').slice(0, 2).join(',')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-4 h-4 text-zinc-400" />
                                                            <span className="font-medium text-zinc-700">{lead.phone}</span>
                                                        </div>
                                                        {lead.website && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Globe className="w-4 h-4 text-zinc-400" />
                                                                <a
                                                                    href={lead.website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#ff5500] hover:underline truncate max-w-[200px]"
                                                                >
                                                                    {lead.website.replace(/^https?:\/\/(www\.)?/, '')}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            <span className="font-medium text-zinc-700">
                                                                {lead.rating?.toFixed(1) || 'N/A'}
                                                            </span>
                                                            <span className="text-xs text-zinc-500">
                                                                ({lead.reviewCount || 0} reviews)
                                                            </span>
                                                        </div>
                                                        {lead.priceLevel && (
                                                            <div className="text-xs text-zinc-600 font-medium">
                                                                Price: {lead.priceLevel}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
