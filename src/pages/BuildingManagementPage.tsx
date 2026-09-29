import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { Building2, Search, Filter, Map as MapIcon, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const BuildingManagementPage: React.FC = () => {
  const { buildings, setSelectedParcelId, navigateTo, showToast } = useGIS();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = buildings.filter(b => {
    const matchSearch = b.id.toLowerCase().includes(search.toLowerCase()) || b.parcelId.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || b.type === typeFilter;
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              AI Building Footprints Registry
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {buildings.length} Vector Footprints
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Segmented structures extracted via computer vision on drone orthomosaics with height and setback analytics.
          </p>
        </div>

        <button
          onClick={() => showToast(`Exported ${filtered.length} building footprints as GeoJSON`)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Footprints</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Building ID (B-00521) or Parcel ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-xs"
            >
              <option value="All">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Newly Detected">Newly Detected</option>
              <option value="Unauthorized">Unauthorized</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Building ID</th>
                <th className="py-3 px-3">Parent Parcel</th>
                <th className="py-3 px-3 font-mono text-right">Footprint Area</th>
                <th className="py-3 px-3 font-mono text-right">Height / Floors</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 font-mono text-right">Confidence</th>
                <th className="py-3 px-3">Detection Source</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {b.id}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                    {b.parcelId}
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-slate-800 dark:text-slate-200">
                    {b.areaSqm} m²
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-slate-600 dark:text-slate-400">
                    {b.heightM?.toFixed(1)}m ({b.floors}F)
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {b.type}
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-emerald-600">
                    {b.confidence}%
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {b.detectionSource}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      b.status === 'Unauthorized' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : b.status === 'Newly Detected'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedParcelId(b.parcelId);
                        navigateTo('parcels');
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-800 dark:text-slate-200 font-semibold"
                    >
                      Inspect Parcel
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
