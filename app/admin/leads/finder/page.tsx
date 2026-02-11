import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions';
import LeadFinderClient from './lead-finder-client';

export default async function LeadFinderPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'Admin') {
        redirect('/admin');
    }

    return <LeadFinderClient />;
}
