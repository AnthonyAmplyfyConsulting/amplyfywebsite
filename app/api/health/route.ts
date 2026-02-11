import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
    const dbState = mongoose.connection.readyState;
    const states: Record<number, string> = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    const dbStatus = states[dbState] || 'unknown';

    return NextResponse.json(
        {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: dbStatus,
            memoryUsage: process.memoryUsage(),
        },
        { status: 200 }
    );
}
