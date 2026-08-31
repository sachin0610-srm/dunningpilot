'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  BrainCircuit, 
  AlertOctagon, 
  RefreshCw, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  FileText,
  Ban
} from 'lucide-react';
import { FailureEvent, RecoveryAttempt, AuditLog } from '@/lib/types/dunning';

interface CaseDetailDrawerProps {
  eventId: string | null;
  onClose: () => void;
  onRefreshParent: () => void;
}

export function CaseDetailDrawer({ eventId, onClose, onRefreshParent }: CaseDetailDrawerProps) {
  const [data, setData] = useState<{
    failure: FailureEvent | null;
    attempts: RecoveryAttempt[];
    auditLogs: AuditLog[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [copiedCopy, setCopiedCopy] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'outreach' | 'audit'>('overview');

  const fetchDetail = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/failures/${id}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load case detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchDetail(eventId);
    }
  }, [eventId]);

  const handleRunCaseAction = async () => {
    if (!eventId) return;
    setExecuting(true);
    try {
      const res = await fetch(`/api/failures/${eventId}`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await fetchDetail(eventId);
        onRefreshParent();
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setExecuting(false);
    }
  };

  if (!eventId) return null;

  const failure = data?.failure;
  const sub = failure?.subscription;
  const playbook = failure?.ai_playbook;

  const getDiagnosisSourceBadge = (source?: string) => {
    switch (source) {
      case 'TIER_2_AI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium">
            <BrainCircuit className="w-3.5 h-3.5" />
            Tier 2: Claude AI
          </span>
        );
      case 'TIER_1_FALLBACK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
            <AlertOctagon className="w-3.5 h-3.5" />
            Tier 1: SLA Fallback
          </span>
        );
      case 'TIER_1_DETERMINISTIC':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Tier 1: Rule Engine
          </span>
        );
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'RECOVERED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">RECOVERED</span>;
      case 'EXHAUSTED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">EXHAUSTED</span>;
      case 'RECOVERY_INITIATED':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">IN PROGRESS</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-semibold">PENDING DIAGNOSIS</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-zinc-900 border-l border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Case Detail</span>
              {getStatusBadge(failure?.recovery_status)}
            </div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              {sub?.customer_name || 'Loading Case...'}
              <span className="text-zinc-400 text-sm font-normal">({sub?.customer_email})</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 px-5 bg-zinc-950/30 font-medium text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Diagnosis & Playbook
          </button>
          <button
            onClick={() => setActiveTab('outreach')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'outreach'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            AI Customer Outreach
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'audit'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Audit Trail ({data?.auditLogs.length || 0})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
              <p className="text-xs font-mono">Fetching full case history & audit logs...</p>
            </div>
          ) : failure ? (
            <>
              {/* Tab 1: Overview & Playbook */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Diagnosis Lineage Box */}
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                        Diagnosis Lineage & Rationale
                      </span>
                      {getDiagnosisSourceBadge(data?.auditLogs[0]?.diagnosis_source)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-zinc-800/60 text-xs">
                      <div>
                        <span className="text-zinc-400 block mb-0.5">Gateway Error Code</span>
                        <span className="font-mono text-zinc-200 font-medium">{failure.error_code}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block mb-0.5">Failure Category</span>
                        <span className="font-mono text-amber-400 font-semibold">{failure.failure_category}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                      <span className="font-semibold text-zinc-200">Error Context:</span> {failure.error_description}
                    </p>
                  </div>

                  {/* Recovery Playbook Summary */}
                  {playbook ? (
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                          Recommended Recovery Strategy
                        </span>
                        <span className="text-xs text-emerald-400 font-mono">
                          Confidence: {Math.round((playbook.confidence_score || 0.9) * 100)}%
                        </span>
                      </div>

                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-emerald-400">{playbook.action_type}</span>
                          <span className="text-zinc-400 font-mono">Retry Delay: {playbook.retry_delay_hours}h</span>
                        </div>
                        <p className="text-xs text-zinc-300">{playbook.recommended_action}</p>
                      </div>

                      <div className="text-xs text-zinc-400 space-y-1">
                        <span className="font-medium text-zinc-300">Explanation Rationale:</span>
                        <p className="leading-relaxed bg-zinc-900 p-2.5 rounded border border-zinc-800 text-zinc-300">
                          {playbook.explanation}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center text-zinc-500 text-xs">
                      No AI playbook generated yet. Click &quot;Execute Workflow&quot; below to trigger diagnosis.
                    </div>
                  )}

                  {/* Stopping Rules Monitor */}
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                      Hard Stopping Rules Monitor
                    </span>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                        <span className="text-zinc-400 block mb-1">Retry Attempts</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-zinc-100">{failure.retry_count}</span>
                          <span className="text-zinc-400 font-mono">/ {failure.max_retries} max</span>
                        </div>
                      </div>
                      <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                        <span className="text-zinc-400 block mb-1">Terminal Stop Status</span>
                        <span className="font-mono text-zinc-200 font-semibold">
                          {failure.stopped_reason ? (
                            <span className="text-rose-400">{failure.stopped_reason}</span>
                          ) : (
                            <span className="text-emerald-400">ACTIVE_RECOVERY</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: AI Customer Outreach */}
              {activeTab === 'outreach' && (
                <div className="space-y-6">
                  {playbook?.customer_outreach_copy ? (
                    <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                          Generated Customer Copy (Tailored for {failure.failure_category})
                        </span>
                        <button
                          onClick={() => {
                            const fullCopy = `Subject: ${playbook.customer_outreach_copy?.subject}\n\n${playbook.customer_outreach_copy?.body}`;
                            navigator.clipboard.writeText(fullCopy);
                            setCopiedCopy(true);
                            setTimeout(() => setCopiedCopy(false), 2000);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all"
                        >
                          {copiedCopy ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedCopy ? 'Copied' : 'Copy Email'}
                        </button>
                      </div>

                      <div className="space-y-3 bg-zinc-900/90 p-4 rounded-lg border border-zinc-800 text-xs">
                        <div>
                          <label className="text-zinc-400 block mb-1 font-semibold">Subject Line</label>
                          <input
                            type="text"
                            readOnly
                            value={playbook.customer_outreach_copy.subject}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-200 font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1 font-semibold">Email Body Copy</label>
                          <textarea
                            readOnly
                            rows={4}
                            value={playbook.customer_outreach_copy.body}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-300 leading-relaxed resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-zinc-400 block mb-1 font-semibold">Call To Action Button Text</label>
                          <div className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-4 py-2 rounded-lg font-semibold text-xs">
                            {playbook.customer_outreach_copy.cta_text} →
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center text-zinc-500 text-xs">
                      No outreach copy generated yet.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Audit Trail */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <div className="relative border-l-2 border-zinc-800 ml-3 pl-6 space-y-6">
                    {data?.auditLogs.map((log) => (
                      <div key={log.id} className="relative group">
                        {/* Timeline Node Dot */}
                        <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-900 shadow-sm shadow-emerald-500/40" />

                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-zinc-200">{log.action}</span>
                            <span className="text-zinc-400 font-mono text-[11px]">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {getDiagnosisSourceBadge(log.diagnosis_source)}
                          </div>

                          {log.payload && (
                            <pre className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800/80 text-[11px] font-mono text-zinc-400 overflow-x-auto">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-xs">Case details unavailable.</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-xs text-zinc-400 font-mono">
            Amount: <span className="text-zinc-100 font-bold">₹{sub?.amount.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all"
            >
              Close
            </button>

            {failure?.recovery_status !== 'RECOVERED' && failure?.recovery_status !== 'EXHAUSTED' && (
              <button
                onClick={handleRunCaseAction}
                disabled={executing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${executing ? 'animate-spin' : ''}`} />
                {executing ? 'Executing Recovery...' : 'Execute Recovery Workflow'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
