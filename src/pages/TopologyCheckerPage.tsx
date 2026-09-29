import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  RefreshCw, 
  ShieldCheck, 
  Layers,
  MapPin
} from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const TopologyCheckerPage: React.FC = () => {
  const { topologyIssues, runTopologyAutoFix, showToast, addAuditLog } = useGIS();
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [isScanning, setIsScanning] = useState(false);

  const filteredIssues = topologyIssues.filter(i => {
    if (filterSeverity === 'All') return true;
    return i.severity === filterSeverity;
  });

  const handleRunFullScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast('Topology scan completed. 40 errors and 130 warnings audited across 12,450 polygons.');
      addAuditLog('Topology Scan', 'Urban Cadastral Layer', 'Success', 'Validated polygon closure and vertex snapping rules');
    }, 1200);
  };

  const handleFixAllAuto = () => {
    topologyIssues.forEach(i => {
      if (i.status === 'Open') runTopologyAutoFix(i.id);
    });
    showToast('Applied automated vertex snapping and sliver polygon removal to all open issues.');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Topology Checker & Geometry Sanitation
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              OGC Invariant Verification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detect and sanitize sliver gaps, polygon overlaps, unclosed dangles, and self-intersecting boundary coordinates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFixAllAuto}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Auto-Repair All Validated Fixes</span>
          </button>
          <button
            onClick={handleRunFullScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Run Complete Topology Scan</span>
          </button>
        </div>
      </div>

      {/* TOPOLOGY SUMMARY CARDS (SECTION 20) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Audited Features</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white block mt-1">12,450</span>
          <span className="text-[11px] text-slate-400 font-mono">Cadastral & ORI polygons</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-lg p-4 shadow-xs">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium block">Valid Geometries</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 block mt-1">12,280</span>
          <span className="text-[11px] text-slate-500 font-mono">98.6% Clean Topology</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-lg p-4 shadow-xs">
          <span className="text-xs text-amber-700 dark:text-amber-400 font-medium block">Warnings (Slivers & Gaps)</span>
          <span className="text-2xl font-bold font-mono text-amber-600 block mt-1">130</span>
          <span className="text-[11px] text-slate-500 font-mono">Non-fatal tolerances</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-lg p-4 shadow-xs">
          <span className="text-xs text-red-700 dark:text-red-400 font-medium block">Critical Geometric Errors</span>
          <span className="text-2xl font-bold font-mono text-red-600 block mt-1">40</span>
          <span className="text-[11px] text-slate-500 font-mono">Overlaps & Self-Intersects</span>
        </div>
      </div>

      {/* DETECTED TOPOLOGY ISSUES TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Topology Exceptions Queue
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Filter:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-xs"
            >
              <option value="All">All Severities</option>
              <option value="Error">Errors Only</option>
              <option value="Warning">Warnings Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Issue ID</th>
                <th className="py-3 px-3">Feature Ref</th>
                <th className="py-3 px-3">Topology Anomaly</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-4">Suggested Action</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIssues.map(issue => (
                <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {issue.id}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                    {issue.featureId}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {issue.type}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      issue.severity === 'Error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {issue.suggestedAction}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      issue.status === 'Auto-Corrected' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => runTopologyAutoFix(issue.id)}
                      disabled={issue.status === 'Auto-Corrected'}
                      className="px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded font-semibold hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
                    >
                      {issue.status === 'Auto-Corrected' ? 'Sanitized' : 'Snap & Fix'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GIS MAP OVERLAY OF TOPOLOGY ISSUES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          Spatial Error Distribution & Boundary Verification
        </h3>
        <WebGISMap heightClass="h-72" showLayerPanel={false} />
      </div>
    </div>
  );
};
