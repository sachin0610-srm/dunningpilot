'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CaseDetailDrawer } from '@/components/cases/CaseDetailDrawer';
import { Search, Filter, ArrowUpRight, ListFilter } from 'lucide-react';
import { FailureEvent, FailureCategory } from '@/lib/types/dunning';

export default function CasesPage() {
  const [failures, setFailures] = useState<FailureEvent[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/failures');
      const json = await res.json();
      if (json.success) {
        setFailures(json.data.failures);
      }
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredFailures = failures.filter((f) => {
    const sub = f.subscription;
    const matchesSearch = 
      sub?.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub?.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.error_code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || f.recovery_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
    <AppLayout>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-850">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                Failure Case Registry
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Payment Failure Workflows
            </h1>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden space-y-4">
          <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs text-zinc-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="RECOVERY_INITIATED">IN PROGRESS</option>
                <option value="RECOVERED">RECOVERED</option>
                <option value="EXHAUSTED">EXHAUSTED</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/60 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Subscription Plan</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Failure Category</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredFailures.map((f) => (
                  <tr key={f.id} className="hover:bg-zinc-800/40 transition-all">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-zinc-100">{f.subscription?.customer_name}</div>
                      <div className="text-zinc-400 font-mono text-[11px]">{f.subscription?.customer_email}</div>
                    </td>
                    <td className="py-4 px-5 text-zinc-300">{f.subscription?.plan_name}</td>
                    <td className="py-4 px-5 font-mono font-bold text-zinc-100">
                      ₹{f.subscription?.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-5 font-mono text-zinc-300">{f.failure_category}</td>
                    <td className="py-4 px-5">{getStatusBadge(f.recovery_status)}</td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedCaseId(f.id)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs inline-flex items-center gap-1"
                      >
                        Inspect Case
                        <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CaseDetailDrawer
        eventId={selectedCaseId}
        onClose={() => setSelectedCaseId(null)}
        onRefreshParent={fetchData}
      />
    </AppLayout>
  );
}
