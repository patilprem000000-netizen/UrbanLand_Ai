import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { ScrollText, Search, Download, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs, showToast } = useGIS();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(log =>
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.datasetOrEntity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Cryptographic Statutory Audit Trail
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
              Immutable Log
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident activity logs capturing every dataset upload, automated AI inference, boundary arbitration, and officer sign-off.
          </p>
        </div>

        <button
          onClick={() => showToast('Exported audit trail log as CSV')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Officer, Action, or Target Dataset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
        <span className="text-slate-400 font-mono text-xs">{filtered.length} Recorded Events</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-3">Officer & Role</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Entity / Dataset</th>
                <th className="py-3 px-4">Technical Details</th>
                <th className="py-3 px-3 font-mono">Timestamp (IST)</th>
                <th className="py-3 px-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {log.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 dark:text-white block">{log.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.role}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-blue-600 dark:text-blue-400">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {log.datasetOrEntity}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
