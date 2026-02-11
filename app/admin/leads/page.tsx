import dbConnect from '@/lib/mongodb';
import { Lead } from '@/lib/models';
import LeadsTable from './leads-table';

export default async function LeadsPage() {
    await dbConnect();

    // Sort leads by created date desc
    const sortedLeads = await Lead.find({}, '-_id -__v').sort({ createdAt: -1 }).lean();

    // Force cast to any to avoid strict type checking on filtered properties vs interface, 
    // or rely on the shape matching. Mongoose lean() returns POJO.
    return <LeadsTable leads={JSON.parse(JSON.stringify(sortedLeads))} />;
}
