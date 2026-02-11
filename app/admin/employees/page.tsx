import { checkAuth, getCurrentUser } from '@/lib/actions';
import dbConnect from '@/lib/mongodb';
import { User } from '@/lib/models';
import { redirect } from 'next/navigation';
import EmployeesTable from './employees-table';

export default async function EmployeesPage() {
    const isAuth = await checkAuth();
    if (!isAuth) redirect('/login');

    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'Admin') {
        redirect('/admin');
    }

    await dbConnect();

    // Sort users: Admin first, then alphabetical
    // Mongoose sort might be simpler: .sort({ role: 1, name: 1 }) but 'Admin' < 'Cold Caller', so Ascending works for role.
    const users = await User.find({}, '-_id -__v').lean();

    const sortedUsers = users.sort((a: any, b: any) => {
        if (a.role === 'Admin' && b.role !== 'Admin') return -1;
        if (a.role !== 'Admin' && b.role === 'Admin') return 1;
        return a.name.localeCompare(b.name);
    });

    return <EmployeesTable users={JSON.parse(JSON.stringify(sortedUsers))} currentUserId={currentUser!.id} />;
}
