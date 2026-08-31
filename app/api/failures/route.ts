import { NextResponse } from 'next/server';
import { getFailureEvents, getRecoveryMetrics } from '@/lib/services/store';

export async function GET() {
  try {
    const failures = await getFailureEvents();
    const metrics = await getRecoveryMetrics();

    return NextResponse.json({
      success: true,
      data: {
        failures,
        metrics
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch failure events' },
      { status: 500 }
    );
  }
}
