'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CaseDetailDrawer } from '@/components/cases/CaseDetailDrawer';
import { 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Search, 
  Filter, 
  ExternalLink,
  BrainCircuit,
  ShieldCheck,
  RefreshCw,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { FailureEvent, RecoveryMetrics, FailureCategory } from '@/lib/types/dunning';

export default function CommandCenterPage() {
  const [failures, setFailures] = useState<FailureEvent[]>([]);
  const [metrics, setMetrics] = useState<RecoveryMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningBatch, setRunningBatch] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/failures');
      const json = await res.json();
      if (json.success) {
        setFailures(json.data.failures);
        setMetrics(json.data.metrics);
      }
    } catch (err) {
      console.error('Failed to fetch command center data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunDemoBatch = async () => {
    setRunningBatch(true);
    try {
      const res = await fetch('/api/batch/run', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await fetchData();
      }
    } catch (err) {
      console.error('Batch run failed:', err);
    } finally {
      setRunningBatch(false);
    }
  };

  const handleResetDemoState = async () => {
    setResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await fetchData();
      }
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setResetting(false);
    }
  };

  const filteredFailures = failures.filter((f) => {
    const sub = f.subscription;
    const nameMatch = sub?.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const emailMatch = sub?.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const codeMatch = f.error_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || emailMatch || codeMatch;

    const matchesCategory = categoryFilter === 'ALL' || f.failure_category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: FailureCategory) => {
    switch (category) {
      case 'SOFT_DECLINE':
        return <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-medium">SOFT_DECLINE</span>;
      case 'CARD_EXPIRATION':
        return <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-medium">CARD_EXPIRATION</span>;
      case 'AUTH_CHALLENGE':
        return <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-medium">AUTH_CHALLENGE</span>;
      case 'HARD_DECLINE':
        return <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-medium">HARD_DECLINE</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECOVERED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">RECOVERED</span>;
      case 'EXHAUSTED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">EXHAUSTED</span>;
      case 'RECOVERY_INITIATED':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">IN PROGRESS</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-semibold">PENDING</span>;
    }
  };

  return (
    <AppLayout onResetDemo={handleResetDemoState} isResetting={resetting}>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Command Center Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                Recovery Command Center
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Subscription Payment Recovery
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Diagnose payment failure causes, route smart workflows, & enforce hard stopping rules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunDemoBatch}
              disabled={runningBatch}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 fill-current ${runningBatch ? 'animate-spin' : ''}`} />
              {runningBatch ? 'Diagnosing & Recovering...' : 'Run Demo Recovery Batch'}
            </button>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Failed Revenue */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Total Failed Revenue</span>
              <AlertCircle className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-bold text-zinc-100 font-mono">
              ₹{(metrics?.total_failed_revenue || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Across <span className="text-zinc-200 font-semibold">{metrics?.total_failed_count || 0}</span> failure events
            </div>
          </div>

          {/* Card 2: Recovery Rate */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Recovery Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {metrics?.recovery_rate_percentage || 0}%
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Target SLA: <span className="text-emerald-400 font-semibold">&gt; 45%</span>
            </div>
          </div>

          {/* Card 3: Recovered Revenue */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Recovered Revenue</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              ₹{(metrics?.total_recovered_revenue || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              <span className="text-emerald-400 font-semibold">{metrics?.total_recovered_count || 0}</span> subscriptions saved
            </div>
          </div>

          {/* Card 4: Active Workflows */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Active Recovery Workflows</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 font-mono">
              {metrics?.active_workflows_count || 0}
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Pending retries &amp; auth links
            </div>
          </div>
        </div>

        {/* Failure Taxonomy Breakdown Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            Failure Taxonomy Routing Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics && (
              <>
                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-blue-400 font-semibold">SOFT_DECLINE</span>
                    <span className="text-zinc-400 font-mono">{metrics.category_breakdown.SOFT_DECLINE.count} cases</span>
                  </div>
                  <div className="text-sm font-mono text-zinc-200">
                    ₹{metrics.category_breakdown.SOFT_DECLINE.revenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Recovered: <span className="text-emerald-400 font-semibold">₹{metrics.category_breakdown.SOFT_DECLINE.recovered.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400 font-semibold">CARD_EXPIRATION</span>
                    <span className="text-zinc-400 font-mono">{metrics.category_breakdown.CARD_EXPIRATION.count} cases</span>
                  </div>
                  <div className="text-sm font-mono text-zinc-200">
                    ₹{metrics.category_breakdown.CARD_EXPIRATION.revenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Recovered: <span className="text-emerald-400 font-semibold">₹{metrics.category_breakdown.CARD_EXPIRATION.recovered.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-400 font-semibold">AUTH_CHALLENGE</span>
                    <span className="text-zinc-400 font-mono">{metrics.category_breakdown.AUTH_CHALLENGE.count} cases</span>
                  </div>
                  <div className="text-sm font-mono text-zinc-200">
                    ₹{metrics.category_breakdown.AUTH_CHALLENGE.revenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Recovered: <span className="text-emerald-400 font-semibold">₹{metrics.category_breakdown.AUTH_CHALLENGE.recovered.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-rose-400 font-semibold">HARD_DECLINE</span>
                    <span className="text-zinc-400 font-mono">{metrics.category_breakdown.HARD_DECLINE.count} cases</span>
                  </div>
                  <div className="text-sm font-mono text-zinc-200">
                    ₹{metrics.category_breakdown.HARD_DECLINE.revenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-rose-400 font-medium">
                    Hard Stop Enforced (0 Retries)
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Failed Payments Data Table */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden space-y-4">
          
          {/* Table Toolbar */}
          <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search customer, email, or gateway code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs text-zinc-400">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="SOFT_DECLINE">SOFT_DECLINE</option>
                  <option value="CARD_EXPIRATION">CARD_EXPIRATION</option>
                  <option value="AUTH_CHALLENGE">AUTH_CHALLENGE</option>
                  <option value="HARD_DECLINE">HARD_DECLINE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/60 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-5">Customer &amp; Subscription</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Razorpay Payment ID</th>
                  <th className="py-3 px-5">Gateway Error</th>
                  <th className="py-3 px-5">Taxonomy Category</th>
                  <th className="py-3 px-5">Recovery Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredFailures.map((f) => {
                  const sub = f.subscription;
                  return (
                    <tr key={f.id} className="hover:bg-zinc-800/40 transition-all group">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-zinc-100">{sub?.customer_name}</div>
                        <div className="text-zinc-400 font-mono text-[11px]">{sub?.customer_email}</div>
                        <div className="text-zinc-400 text-[11px]">{sub?.plan_name}</div>
                      </td>
                      <td className="py-4 px-5 font-mono font-bold text-zinc-100">
                        ₹{sub?.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-5 font-mono text-zinc-400">
                        {f.razorpay_payment_id}
                      </td>
                      <td className="py-4 px-5 max-w-xs">
                        <div className="font-mono text-amber-400 font-medium text-[11px]">{f.error_code}</div>
                        <div className="text-zinc-400 truncate text-[11px]">{f.error_description}</div>
                      </td>
                      <td className="py-4 px-5">
                        {getCategoryBadge(f.failure_category)}
                      </td>
                      <td className="py-4 px-5">
                        {getStatusBadge(f.recovery_status)}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedCaseId(f.id)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-medium text-xs transition-all inline-flex items-center gap-1"
                        >
                          Inspect Case
                          <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Case Detail Drawer */}
      <CaseDetailDrawer
        eventId={selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
        onRefreshParent={fetchData}
      />
    </AppLayout>
  );
}
