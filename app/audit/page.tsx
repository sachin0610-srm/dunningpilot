'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CaseDetailDrawer } from '@/components/cases/CaseDetailDrawer';
import { 
  Terminal, 
  BrainCircuit, 
  ShieldCheck, 
  AlertOctagon, 
  Search, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  Zap,
  Clock,
  RefreshCw
} from 'lucide-react';
import { EnrichedAuditLog, DiagnosisSource } from '@/lib/types/dunning';

interface AuditStats {
  totalLogs: number;
  aiDiagnosedCount: number;
  tier1RuleCount: number;
  fallbackCount: number;
  recoveredCount: number;
  terminalStopCount: number;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<EnrichedAuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit');
      const json = await res.json();
      if (json.success) {
        setLogs(json.data.logs);
        setStats(json.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await fetchAuditData();
      }
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setResetting(false);
    }
  };

  const toggleExpandPayload = (id: string) => {
    setExpandedPayloads(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyJson = (id: string, payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = logs.filter(log => {
    const customerMatch = 
      (log.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.error_code?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.action.toLowerCase().includes(searchQuery.toLowerCase()));

    const sourceMatch = sourceFilter === 'ALL' || log.diagnosis_source === sourceFilter;
    const actionMatch = actionFilter === 'ALL' || log.action === actionFilter;

    return customerMatch && sourceMatch && actionMatch;
  });

  const getSourceBadge = (source: DiagnosisSource) => {
    switch (source) {
      case 'TIER_2_AI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-medium">
            <BrainCircuit className="w-3.5 h-3.5" />
            TIER_2_AI
          </span>
        );
      case 'TIER_1_FALLBACK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
            <AlertOctagon className="w-3.5 h-3.5" />
            SLA_FALLBACK
          </span>
        );
      case 'TIER_1_DETERMINISTIC':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            TIER_1_RULES
          </span>
        );
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('RECOVERED')) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
          {action}
        </span>
      );
    }
    if (action.includes('STOPPING_RULE') || action.includes('TERMINAL')) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-semibold">
          {action}
        </span>
      );
    }
    if (action.includes('AI_DIAGNOSED') || action.includes('WORKFLOW')) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-semibold">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-mono font-semibold">
        {action}
      </span>
    );
  };

  return (
    <AppLayout onResetDemo={handleResetDemo} isResetting={resetting}>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                System Audit &amp; Decision Lineage
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
              Audit Trail Logs
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {logs.length} Events
              </span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Immutable ledger of every AI classification, deterministic fallback, gateway action, and stopping rule enforcement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAuditData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
              Refresh Feed
            </button>
          </div>
        </div>

        {/* Audit Stats KPI Bar */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                <span>Total Recorded Events</span>
                <Terminal className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-2xl font-bold text-zinc-100 font-mono">
                {stats.totalLogs}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Immutable system audit trail
              </div>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                <span>AI Diagnosed (Tier 2)</span>
                <BrainCircuit className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400 font-mono">
                {stats.aiDiagnosedCount}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Llama 3.2 &amp; Claude 3.5 SLA passes
              </div>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                <span>Recoveries Succeeded</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {stats.recoveredCount}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Payments reclaimed through engine
              </div>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
                <span>Stopping Rules Enforced</span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-rose-400 font-mono">
                {stats.terminalStopCount}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Terminal hard stops &amp; retry caps
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by customer, email, action, error code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs text-zinc-400">Diagnosis Source:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="ALL">All Sources</option>
                <option value="TIER_2_AI">TIER_2_AI (Claude / Llama)</option>
                <option value="TIER_1_DETERMINISTIC">TIER_1_DETERMINISTIC</option>
                <option value="TIER_1_FALLBACK">TIER_1_FALLBACK (SLA Timeout)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Action:</span>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="ALL">All Action Types</option>
                <option value="CASE_CREATED">CASE_CREATED</option>
                <option value="TIER_2_AI_DIAGNOSED">TIER_2_AI_DIAGNOSED</option>
                <option value="RECOVERY_WORKFLOW_EXECUTED">RECOVERY_WORKFLOW_EXECUTED</option>
                <option value="PAYMENT_RECOVERED_SUCCESS">PAYMENT_RECOVERED_SUCCESS</option>
                <option value="STOPPING_RULE_ENFORCED">STOPPING_RULE_ENFORCED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Feed */}
        <div className="relative border-l-2 border-zinc-800 ml-4 pl-8 space-y-6">
          {loading ? (
            <div className="py-20 text-center text-zinc-500 text-xs font-mono space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
              <p>Fetching full audit event history...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-500 text-xs space-y-2">
              <Terminal className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
              <div className="font-semibold text-zinc-400">No matching audit logs found</div>
              <p className="text-zinc-500">Try adjusting your search query or source filters, or run the demo batch.</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = !!expandedPayloads[log.id];
              const isCopied = copiedId === log.id;

              return (
                <div key={log.id} className="relative group">
                  
                  {/* Timeline Dot Node */}
                  <div className={`absolute -left-[41px] top-4 w-4 h-4 rounded-full border-4 border-zinc-950 ${
                    log.action.includes('RECOVERED')
                      ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50'
                      : log.action.includes('STOPPING_RULE')
                      ? 'bg-rose-400 shadow-lg shadow-rose-500/50'
                      : log.diagnosis_source === 'TIER_2_AI'
                      ? 'bg-purple-400 shadow-lg shadow-purple-500/50'
                      : 'bg-zinc-400'
                  }`} />

                  {/* Card Body */}
                  <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-5 space-y-4 transition-all shadow-md">
                    
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {getActionBadge(log.action)}
                        {getSourceBadge(log.diagnosis_source)}
                        {log.failure_category && (
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[11px] font-mono">
                            {log.failure_category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span>{new Date(log.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Customer & Failure Context */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs bg-zinc-950/60 p-3 rounded-xl border border-zinc-850">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-bold text-xs text-zinc-200">
                          {log.customer_name ? log.customer_name.charAt(0) : 'C'}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-200">
                            {log.customer_name || 'Generic Customer'}
                          </div>
                          <div className="text-zinc-500 font-mono text-[11px]">
                            {log.customer_email || 'customer@gateway.in'} • {log.plan_name || 'Subscription'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {log.amount && (
                          <div className="text-right font-mono">
                            <span className="text-zinc-500 block text-[10px] uppercase">Amount</span>
                            <span className="font-bold text-zinc-200">₹{log.amount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {log.error_code && (
                          <div className="text-right font-mono">
                            <span className="text-zinc-500 block text-[10px] uppercase">Gateway Code</span>
                            <span className="text-amber-400 font-medium">{log.error_code}</span>
                          </div>
                        )}
                        {log.failure_event_id && (
                          <button
                            onClick={() => setSelectedCaseId(log.failure_event_id)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium text-xs transition-all inline-flex items-center gap-1"
                          >
                            Inspect
                            <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Payload Collapsible View */}
                    {log.payload && Object.keys(log.payload).length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleExpandPayload(log.id)}
                            className="text-xs font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-all"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            <span>{isExpanded ? 'Hide Raw Audit JSON Payload' : 'View Raw Audit JSON Payload'}</span>
                          </button>

                          <button
                            onClick={() => handleCopyJson(log.id, log.payload)}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[11px] font-mono transition-all"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {isCopied ? 'Copied JSON' : 'Copy'}
                          </button>
                        </div>

                        {isExpanded && (
                          <pre className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed animate-in fade-in-50 duration-150">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Case Detail Drawer for interactive audit inspection */}
      <CaseDetailDrawer
        eventId={selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
        onRefreshParent={fetchAuditData}
      />
    </AppLayout>
  );
}
