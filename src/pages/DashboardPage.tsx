import React from 'react';
import { useGIS } from '../services/gisContext';
import { 
  Database, 
  MapPin, 
  Building2, 
  AlertTriangle, 
  UserCheck, 
  TrendingUp, 
  History, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  Cpu, 
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const DashboardPage: React.FC = () => {
  const { 
    parcels, 
    buildings, 
    datasets, 
    conflicts, 
    verificationTasks, 
    changeEvents,
    navigateTo, 
    triggerAIHarmonization,
    setSelectedConflictId,
    setSelectedParcelId
  } = useGIS();

  const pendingConflicts = conflicts.filter(c => c.status !== 'Resolved');
  const pendingTasks = verificationTasks.filter(t => t.status === 'Pending');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Mission Statement */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
              Enterprise Land Information System — Active Cluster
            </span>
            <span className="text-xs text-slate-400 font-mono">EPSG:32643 (UTM 43N)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Urban Land Record Harmonization Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            "Transforming fragmented geospatial data into a unified, intelligent and verifiable urban land information system."
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={triggerAIHarmonization}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Run Harmonization Batch</span>
          </button>
          <button
            onClick={() => navigateTo('data-upload')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Dataset</span>
          </button>
        </div>
      </div>

      {/* KPI STATISTICS GRID */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            System Synchronization Metrics
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            DEMO / SAMPLE VALUES
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
            <span className="text-[10px] text-slate-400 block truncate">Total Datasets</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono block mt-1">128</span>
            <span className="text-[10px] text-slate-500 font-mono">112 Processed</span>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
            <span className="text-[10px] text-slate-400 block truncate">Total Parcels</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono block mt-1">12,450</span>
            <span className="text-[10px] text-slate-500 font-mono">{parcels.length} Active in View</span>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
            <span className="text-[10px] text-slate-400 block truncate">Buildings Detected</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono block mt-1">8,720</span>
            <span className="text-[10px] text-emerald-600 font-mono">AI ORI Extracted</span>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => navigateTo('conflicts')}
            className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 rounded-lg p-3 shadow-xs cursor-pointer hover:border-red-500 transition-colors"
          >
            <span className="text-[10px] text-red-500 font-medium block truncate">Active Conflicts</span>
            <span className="text-xl font-bold text-red-600 font-mono block mt-1">{pendingConflicts.length}</span>
            <span className="text-[10px] text-slate-500 font-mono">Requires Resolution</span>
          </div>

          {/* Card 5 */}
          <div 
            onClick={() => navigateTo('verification')}
            className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-lg p-3 shadow-xs cursor-pointer hover:border-amber-500 transition-colors"
          >
            <span className="text-[10px] text-amber-600 font-medium block truncate">Verification Queue</span>
            <span className="text-xl font-bold text-amber-600 font-mono block mt-1">{pendingTasks.length}</span>
            <span className="text-[10px] text-slate-500 font-mono">Officer Sign-off</span>
          </div>

          {/* Card 6 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
            <span className="text-[10px] text-slate-400 block truncate">High Confidence</span>
            <span className="text-xl font-bold text-emerald-600 font-mono block mt-1">94.2%</span>
            <span className="text-[10px] text-slate-500 font-mono">&gt;90% Score</span>
          </div>

          {/* Card 7 */}
          <div 
            onClick={() => navigateTo('change-detection')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs cursor-pointer hover:border-purple-500 transition-colors"
          >
            <span className="text-[10px] text-slate-400 block truncate">Detected Changes</span>
            <span className="text-xl font-bold text-purple-600 font-mono block mt-1">326</span>
            <span className="text-[10px] text-slate-500 font-mono">2024 vs 2026 ORI</span>
          </div>

          {/* Card 8 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
            <span className="text-[10px] text-slate-400 block truncate">Topology Health</span>
            <span className="text-xl font-bold text-blue-600 font-mono block mt-1">98.6%</span>
            <span className="text-[10px] text-slate-500 font-mono">Clean Geometries</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD INTERACTIVE MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Live WebGIS Geospatial Harmonization Canvas
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              · Click any parcel to inspect source contributions
            </span>
          </div>
          <button
            onClick={() => navigateTo('gis-map')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Full Workstation View</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <WebGISMap heightClass="h-[520px]" showLayerPanel={true} />
      </div>

      {/* TWO COLUMN GRID: RECENT CONFLICTS & DATASET STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Spatial Conflicts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Active Spatial Conflicts
              </h3>
            </div>
            <button
              onClick={() => navigateTo('conflicts')}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              View All ({conflicts.length})
            </button>
          </div>

          <div className="space-y-2">
            {conflicts.slice(0, 3).map(c => (
              <div 
                key={c.id}
                onClick={() => {
                  setSelectedConflictId(c.id);
                  setSelectedParcelId(c.parcelId);
                  navigateTo('conflicts');
                }}
                className="p-2.5 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-700 bg-slate-50 dark:bg-slate-800/40 cursor-pointer transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-red-600">{c.id}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{c.type}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    c.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {c.severity} Severity
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  Parcel {c.parcelId} (Survey {c.surveyNumber}) · {c.aiRecommendation}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400 font-mono">
                  <span>Sources: {c.sources.join(' + ')}</span>
                  <span className="text-red-600 font-bold">Delta: {c.areaDifferenceSqm} m²</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Integrated Geospatial Datasets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Multi-Source Geospatial Datasets
              </h3>
            </div>
            <button
              onClick={() => navigateTo('datasets')}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Dataset Registry
            </button>
          </div>

          <div className="space-y-2">
            {datasets.slice(0, 3).map(ds => (
              <div 
                key={ds.id}
                onClick={() => navigateTo('datasets')}
                className="p-2.5 rounded-md border border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-slate-50 dark:bg-slate-800/40 cursor-pointer transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[260px]">
                    {ds.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {ds.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>{ds.sourceType} · {ds.format}</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">{ds.featuresCount} features</span>
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400 font-mono">
                  <span>CRS: {ds.crsOriginal} → {ds.crsTarget}</span>
                  <span>Confidence: {ds.confidenceScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
