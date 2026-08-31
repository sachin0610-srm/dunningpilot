'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Terminal, BrainCircuit, ShieldCheck, AlertOctagon } from 'lucide-react';
import { AuditLog } from '@/lib/types/dunning';

export default function AuditPage() {
  const [failures, setFailures] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/failures');
      const json = await res.json();
      if (json.success) {
        setFailures(json.data.failures);
      }
    } catch (err) {
      console.error('Failed to fetch audit data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case 'TIER_2_AI':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-mono font-medium">
            <BrainCircuit className="w-3 h-3" />
            TIER_2_AI
          </span>
        );
      case 'TIER_1_FALLBACK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-medium">
            <AlertOctagon className="w-3 h-3" />
            TIER_1_FALLBACK
          </span>
        );
      case 'TIER_1_DETERMINISTIC':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-medium">
            <ShieldCheck className="w-3 h-3" />
            TIER_1_DETERMINISTIC
          </span>
        );
    }
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="pb-6 border-b border-zinc-850">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
              System Audit &amp; Decision Lineage
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Audit Trail Logs
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Immutable log of every classification, SLA timeout, gateway retry, &amp; hard stopping rule.
          </p>
        </div>

        {/* Audit Log Entries */}
        <div className="space-y-4">
          {failures.map((f) => (
            <div key={f.id} className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-xl space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-zinc-100 text-sm">{f.subscription?.customer_name}</span>
                  <span className="text-xs font-mono text-zinc-400">({f.subscription?.customer_email})</span>
                  <span className="text-xs font-mono text-amber-400">Error: {f.error_code}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span>Status: <strong className="text-zinc-200">{f.recovery_status}</strong></span>
                  {f.stopped_reason && <span className="text-rose-400">({f.stopped_reason})</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="text-zinc-400 font-mono block">Taxonomy &amp; Diagnosis Lineage</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-200">{f.failure_category}</span>
                    {getSourceBadge(f.ai_playbook ? 'TIER_2_AI' : 'TIER_1_DETERMINISTIC')}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-zinc-400 font-mono block">Recovery Action Executed</span>
                  <div className="font-mono text-emerald-400 font-medium">
                    {f.ai_playbook?.action_type || 'DIAGNOSIS_PENDING'}
                  </div>
                </div>
              </div>

              {f.ai_playbook && (
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div className="text-zinc-300 font-semibold">Playbook Recommendation:</div>
                  <div>{f.ai_playbook.recommended_action}</div>
                  <div className="text-zinc-400">Reason: {f.ai_playbook.explanation}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
