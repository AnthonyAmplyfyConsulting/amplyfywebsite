import { readDB } from '@/lib/db';
import LeadsTable from './leads-table';

export default async function LeadsPage() {
    const db = await readDB();

    // Sort leads by created date desc
    const sortedLeads = [...db.leads].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return <LeadsTable leads={sortedLeads} />;
}
