import { checkAuth, getCurrentUser, logout } from '@/lib/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut, FileText, Briefcase, Search } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        redirect('/login');
    }

    const user = await getCurrentUser();
    const isAdmin = user?.role === 'Admin';

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-zinc-200 fixed h-full hidden md:flex flex-col">
                <div className="p-8 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <span className="font-bold text-xl text-zinc-900 tracking-tight">Amplyfy</span>
                    </div>
                    {user && (
                        <div className="mt-4 text-xs text-zinc-400">
                            Logged in as <span className="font-semibold text-zinc-600">{user.name}</span>
                            <br />
                            <span className="uppercase text-[10px] tracking-wider bg-zinc-100 px-1.5 py-0.5 rounded mt-1 inline-block">{user.role}</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl transition-colors font-medium">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl transition-colors font-medium">
                        <Users className="w-5 h-5" />
                        Leads
                    </Link>

                    {isAdmin && (
                        <>
                            <Link href="/admin/leads/finder" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl transition-colors font-medium">
                                <Search className="w-5 h-5" />
                                Lead Finder
                            </Link>
                            <Link href="/admin/expenses" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl transition-colors font-medium">
                                <FileText className="w-5 h-5" />
                                Expenses
                            </Link>
                            <Link href="/admin/employees" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl transition-colors font-medium">
                                <Briefcase className="w-5 h-5" />
                                Employees
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-zinc-100">
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-auto md:ml-64">
                <main className="p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div >
    );
}
