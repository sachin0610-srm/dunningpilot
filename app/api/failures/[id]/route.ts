import { NextRequest, NextResponse } from 'next/server';
import { getFailureEventById, processFailureEventRecovery } from '@/lib/services/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const detail = await getFailureEventById(id);

    if (!detail.failure) {
      return NextResponse.json({ success: false, error: 'Failure event not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: detail
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch failure event detail' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await processFailureEventRecovery(id);

    return NextResponse.json({
      success: true,
      data: result,
      message: `Recovery workflow executed for case ${id}`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to process recovery workflow' },
      { status: 500 }
    );
  }
}
