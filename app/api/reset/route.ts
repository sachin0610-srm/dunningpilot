import { NextResponse } from 'next/server';
import { resetDemoState, getRecoveryMetrics } from '@/lib/services/store';

export async function POST() {
  try {
    resetDemoState();
    const metrics = await getRecoveryMetrics();

    return NextResponse.json({
      success: true,
      data: { metrics },
      message: 'Demo state reset to initial pending state'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to reset demo state' },
      { status: 500 }
    );
  }
}
