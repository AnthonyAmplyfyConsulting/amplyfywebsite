import dbConnect from '@/lib/mongodb';
import { Expense } from '@/lib/models';
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

    await dbConnect();

    // Sort by createdAt desc
    const sortedExpenses = await Expense.find({}, '-_id -__v').sort({ createdAt: -1 }).lean();

    return <ExpensesTable expenses={JSON.parse(JSON.stringify(sortedExpenses))} />;
}
