import React from 'react';
import { useGIS } from '../services/gisContext';
import { BarChart3, TrendingUp, CheckCircle2, ShieldCheck, PieChart, Activity, Clock } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { parcels, conflicts, datasets, changeEvents } = useGIS();

  // Compute confidence distribution
  const highConf = parcels.filter(p => p.confidenceScore >= 90).length;
  const medConf = parcels.filter(p => p.confidenceScore >= 75 && p.confidenceScore < 90).length;
  const lowConf = parcels.filter(p => p.confidenceScore < 75).length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Geospatial Analytics & Data Quality Index
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
              Quality Score: 94.2 / 100
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Statistical metrics on multi-source ingestion performance, confidence score distributions, and resolution velocity.
          </p>
        </div>
      </div>

      {/* TOP ANALYTICS KPI ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 block">Overall Data Integrity</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 block">94.2%</span>
          <span className="text-[11px] text-slate-400 font-mono">+3.8% post-harmonization</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 block">Mean Processing Latency</span>
          <span className="text-2xl font-bold font-mono text-blue-600 block">3.4 sec</span>
          <span className="text-[11px] text-slate-400 font-mono">1,420 features/batch</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 block">Resolution Velocity</span>
          <span className="text-2xl font-bold font-mono text-purple-600 block">85.7%</span>
          <span className="text-[11px] text-slate-400 font-mono">Conflicts settled in 24h</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 block">Centroid Deviation RMSE</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white block">0.38 m</span>
          <span className="text-[11px] text-slate-400 font-mono">Within 0.5m legal threshold</span>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Confidence Score Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
              Confidence Score Distribution
            </h3>
            <span className="text-[11px] font-mono text-slate-500">{parcels.length} Total Parcels</span>
          </div>

          <div className="space-y-3 font-mono">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-sans">High Confidence (&gt;90%)</span>
                <span>{highConf} parcels ({Math.round((highConf / parcels.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(highConf / parcels.length) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-700 dark:text-amber-400 font-bold font-sans">Medium Confidence (75%–89%)</span>
                <span>{medConf} parcels ({Math.round((medConf / parcels.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(medConf / parcels.length) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-700 dark:text-red-400 font-bold font-sans">Needs Review (&lt;75%)</span>
                <span>{lowConf} parcels ({Math.round((lowConf / parcels.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${(lowConf / parcels.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Conflicts by Classification Type */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
              Disputes by Classification Category
            </h3>
            <span className="text-[11px] font-mono text-red-600 font-bold">{conflicts.length} Active & Cataloged</span>
          </div>

          <div className="space-y-2.5 font-mono">
            {[
              { type: 'Boundary Discrepancy', count: 4, pct: 40, color: 'bg-red-500' },
              { type: 'Area Delta (>15 sq.m)', count: 3, pct: 30, color: 'bg-amber-500' },
              { type: 'Setback / Building Encroach', count: 2, pct: 20, color: 'bg-blue-500' },
              { type: 'Utility Easement Overlap', count: 1, pct: 10, color: 'bg-purple-500' },
            ].map(item => (
              <div key={item.type}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-sans text-slate-700 dark:text-slate-300">{item.type}</span>
                  <span>{item.count} cases ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
