import { NextRequest, NextResponse } from 'next/server';
import { findLeads } from '@/lib/google-places';

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        const results = await findLeads({ query });
        return NextResponse.json(results);
    } catch (error) {
        console.error('Find leads API error:', error);
        return NextResponse.json(
            { error: 'Failed to find leads' },
            { status: 500 }
        );
    }
}
