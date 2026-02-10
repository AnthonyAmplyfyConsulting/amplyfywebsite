import { readDB } from '@/lib/db';
import ExpensesTable from './expenses-table';
import { checkAuth, getCurrentUser } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function ExpensesPage() {
    const isAuth = await checkAuth();
    if (!isAuth) redirect('/login');

    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'Admin') {
        redirect('/admin');
    }

    const db = await readDB();

    // Sort by createdAt desc
    const sortedExpenses = [...(db.expenses || [])].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return <ExpensesTable expenses={sortedExpenses} />;
}
