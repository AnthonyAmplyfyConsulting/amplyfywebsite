import { checkAuth, getCurrentUser } from '@/lib/actions';
import { readDB } from '@/lib/db';
import { redirect } from 'next/navigation';
import EmployeesTable from './employees-table';

export default async function EmployeesPage() {
    const isAuth = await checkAuth();
    if (!isAuth) redirect('/login');

    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'Admin') {
        redirect('/admin');
    }

    const db = await readDB();
    // Sort users: Admin first, then alphabetical
    const sortedUsers = [...(db.users || [])].sort((a, b) => {
        if (a.role === 'Admin' && b.role !== 'Admin') return -1;
        if (a.role !== 'Admin' && b.role === 'Admin') return 1;
        return a.name.localeCompare(b.name);
    });

    return <EmployeesTable users={sortedUsers} currentUserId={currentUser.id} />;
}
