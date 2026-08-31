import { NextResponse } from 'next/server';
import { runBatchRecoveryProcess, getRecoveryMetrics } from '@/lib/services/store';

export async function POST() {
  try {
    const batchResult = await runBatchRecoveryProcess();
    const metrics = await getRecoveryMetrics();

    return NextResponse.json({
      success: true,
      data: {
        batchResult,
        metrics
      },
      message: `Batch recovery complete: Processed ${batchResult.processedCount} cases, Recovered ₹${batchResult.totalRecoveredAmount.toLocaleString('en-IN')}`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to run batch recovery process' },
      { status: 500 }
    );
  }
}
