import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { Landmark, Search, Filter, Download, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

export const RevenueRecordsPage: React.FC = () => {
  const { parcels, setSelectedParcelId, navigateTo, showToast } = useGIS();
  const [search, setSearch] = useState('');

  const filtered = parcels.filter(p => 
    p.surveyNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Revenue Records & Record of Rights (7/12 & Khatauni)
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
              Statutory Title Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official land tenure titles and survey sub-divisions synchronized with spatial vector polygons.
          </p>
        </div>

        <button
          onClick={() => showToast('Exported statutory 7/12 Land Register as CSV')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export 7/12 Register</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Survey Number (45/2), Owner Name, or Parcel ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
        <span className="text-slate-400 text-xs font-mono">{filtered.length} Harmonized Records</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Survey Number</th>
                <th className="py-3 px-3">Associated Spatial Parcel</th>
                <th className="py-3 px-4">Title Holder / Owner Name</th>
                <th className="py-3 px-3 font-mono text-right">Stated Area</th>
                <th className="py-3 px-3">Tenure Classification</th>
                <th className="py-3 px-3">Statutory Source</th>
                <th className="py-3 px-3">Revenue Status</th>
                <th className="py-3 px-3">Last Attested</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {p.surveyNumber}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">
                    {p.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {p.ownerName}
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-slate-800 dark:text-slate-200">
                    {p.areaSqm.toLocaleString()} sq.m
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {p.landType}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    District Settlement 7/12
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      p.revenueStatus === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {p.revenueStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {p.lastUpdated}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedParcelId(p.id);
                        navigateTo('parcels');
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-800 dark:text-slate-200 font-semibold"
                    >
                      Inspect Spatial Record
                    </button>
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
