import { NextResponse } from 'next/server';
import { getAllAuditLogs } from '@/lib/services/store';

export async function GET() {
  try {
    const logs = await getAllAuditLogs();

    // Compute stats on audit trail
    const totalLogs = logs.length;
    const aiDiagnosedCount = logs.filter(l => l.diagnosis_source === 'TIER_2_AI').length;
    const tier1RuleCount = logs.filter(l => l.diagnosis_source === 'TIER_1_DETERMINISTIC').length;
    const fallbackCount = logs.filter(l => l.diagnosis_source === 'TIER_1_FALLBACK').length;
    const recoveredCount = logs.filter(l => l.action.includes('RECOVERED')).length;
    const terminalStopCount = logs.filter(l => l.action.includes('STOPPING_RULE') || (l.payload && l.payload.rule?.includes('TERMINAL'))).length;

    return NextResponse.json({
      success: true,
      data: {
        logs,
        stats: {
          totalLogs,
          aiDiagnosedCount,
          tier1RuleCount,
          fallbackCount,
          recoveredCount,
          terminalStopCount
        }
      }
    });
  } catch (err: any) {
    console.error('Error fetching audit logs:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
