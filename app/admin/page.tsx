import dbConnect from '@/lib/mongodb';
import { Lead } from '@/lib/models';
import { DollarSign, Users, Briefcase, Flame, Thermometer, Snowflake } from 'lucide-react';

async function getStats() {
    await dbConnect();
    const totalLeads = await Lead.countDocuments({});
    const hotLeads = await Lead.countDocuments({ status: 'Hot' });
    const warmLeads = await Lead.countDocuments({ status: 'Warm' });
    const coldLeads = await Lead.countDocuments({ status: 'Cold' });

    // Assuming 'Revenue' and 'Clients' are manually tracked or derived for now. 
    // Using dummy derivation or just 0 for MVP.
    const revenue = 0;
    const clients = 0;

    return { totalLeads, hotLeads, warmLeads, coldLeads, revenue, clients };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Revenue - Large Card */}
                <div className="col-span-1 md:col-span-2 p-8 bg-white/60 backdrop-blur-xl border border-white/20 shadow-sm rounded-3xl flex flex-col justify-between h-48 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <DollarSign className="w-5 h-5" />
                            <span className="font-medium">Total Revenue</span>
                        </div>
                        <div className="text-5xl font-bold text-zinc-900 tracking-tight">
                            ${stats.revenue.toLocaleString()}
                        </div>
                    </div>
                    <div className="relative z-10 text-sm text-green-600 font-medium">
                        +0% from last month
                    </div>
                </div>

                {/* Clients */}
                <div className="col-span-1 p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-sm rounded-3xl flex flex-col justify-between h-48 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Briefcase className="w-5 h-5" />
                            <span className="font-medium">Active Clients</span>
                        </div>
                        <div className="text-4xl font-bold text-zinc-900">
                            {stats.clients}
                        </div>
                    </div>
                </div>

                {/* Total Leads */}
                <div className="col-span-1 p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-sm rounded-3xl flex flex-col justify-between h-48 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Total Leads</span>
                        </div>
                        <div className="text-4xl font-bold text-zinc-900">
                            {stats.totalLeads}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lead Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-zinc-500 text-sm font-medium mb-1">Hot Leads</div>
                        <div className="text-2xl font-bold text-zinc-900">{stats.hotLeads}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <Flame className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-zinc-500 text-sm font-medium mb-1">Warm Leads</div>
                        <div className="text-2xl font-bold text-zinc-900">{stats.warmLeads}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Thermometer className="w-5 h-5" />
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-zinc-500 text-sm font-medium mb-1">Cold Leads</div>
                        <div className="text-2xl font-bold text-zinc-900">{stats.coldLeads}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Snowflake className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Client List (Empty for now as requested) */}
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-8 min-h-[300px]">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Clients</h2>
                <div className="flex flex-col items-center justify-center h-full text-zinc-400 py-12">
                    <Briefcase className="w-12 h-12 mb-4 opacity-20" />
                    <p>No active clients yet.</p>
                </div>
            </div>

        </div>
    );
}
