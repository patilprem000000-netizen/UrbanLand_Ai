import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { SpatialConflict } from '../types/gis';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Check, 
  X, 
  Clock, 
  Send,
  Building,
  UserCheck
} from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const ConflictsPage: React.FC = () => {
  const { 
    conflicts, 
    selectedConflictId, 
    setSelectedConflictId, 
    setSelectedParcelId,
    resolveConflict, 
    requestGroundSurvey, 
    navigateTo,
    showToast 
  } = useGIS();

  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [resolutionAction, setResolutionAction] = useState<string>('Use GNSS');
  const [resolutionNote, setResolutionNote] = useState('');

  const activeConflict = conflicts.find(c => c.id === selectedConflictId) || conflicts[0];

  const filtered = conflicts.filter(c => {
    const matchType = filterType === 'All' || c.type === filterType;
    const matchStatus = filterStatus === 'All' || (filterStatus === 'Active' ? c.status !== 'Resolved' : c.status === filterStatus);
    return matchType && matchStatus;
  });

  const handleApplyResolution = (action: string) => {
    if (!activeConflict) return;
    resolveConflict(activeConflict.id, action, resolutionNote);
    setResolutionModalOpen(false);
    setResolutionNote('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Spatial Conflicts & Boundary Arbitration
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800 font-semibold">
              {conflicts.filter(c => c.status !== 'Resolved').length} Active Issues
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detect cross-layer geometric discrepancies, area disputes, and municipal setback encroachments with statutory arbitration protocols.
          </p>
        </div>

        <button
          onClick={() => {
            const pending = conflicts.find(c => c.status !== 'Resolved');
            if (pending) {
              setSelectedConflictId(pending.id);
              setSelectedParcelId(pending.parcelId);
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Review Next Active Dispute</span>
        </button>
      </div>

      {/* SECTION 23: CONFLICT DETAIL VIEW (3-LAYER COMPARISON) */}
      {activeConflict && (
        <div className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900/60 rounded-lg p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg font-mono text-red-600 dark:text-red-400">
                  {activeConflict.id}
                </span>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {activeConflict.type}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  activeConflict.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {activeConflict.severity} Priority
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Target Parcel: <button onClick={() => { setSelectedParcelId(activeConflict.parcelId); navigateTo('parcels'); }} className="text-blue-600 font-bold hover:underline">{activeConflict.parcelId}</button> · Survey #{activeConflict.surveyNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                activeConflict.status === 'Resolved' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {activeConflict.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3-LAYER MAP COMPARISON VISUAL */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  3-Layer Spatial Overlay (Revenue vs Municipal vs GNSS)
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-blue-600 font-bold">■ Revenue</span>
                  <span className="text-amber-600 font-bold">■ Municipal</span>
                  <span className="text-emerald-600 font-bold">■ GNSS RTK</span>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 h-80">
                <WebGISMap 
                  heightClass="h-full" 
                  showLayerPanel={false} 
                  highlightParcelId={activeConflict.parcelId}
                />
              </div>
            </div>

            {/* THREE-WAY METRICS & RESOLUTION CONTROLS */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              {/* Quantitative discrepancies */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2.5 font-mono text-[11px]">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-sans">Revenue Record Area:</span>
                  <span className="font-bold text-blue-600">{activeConflict.revenueAreaSqm} sq.m</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-sans">Municipal GIS Area:</span>
                  <span className="font-bold text-amber-600">{activeConflict.municipalAreaSqm} sq.m</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-sans">CORS GNSS RTK Area:</span>
                  <span className="font-bold text-emerald-600">{activeConflict.gnssAreaSqm} sq.m</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-sans">Area Discrepancy Delta:</span>
                  <span className="font-bold text-red-600">{activeConflict.areaDifferenceSqm} sq.m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">AI Confidence Score:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeConflict.confidenceScore}%</span>
                </div>
              </div>

              {/* AI Recommendation Box */}
              <div className="p-3 bg-red-50/60 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-900 dark:text-red-300">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>Statutory Recommendation</span>
                </div>
                <p className="text-[11px] text-red-800 dark:text-red-300 leading-relaxed">
                  {activeConflict.aiRecommendation}
                </p>
              </div>

              {/* RESOLUTION ACTION BUTTONS (SECTION 23) */}
              {activeConflict.status !== 'Resolved' ? (
                <div className="space-y-2 pt-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                    Officer Reconciliation Decision
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApplyResolution('Adopt CORS GNSS Ground Reference')}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-[11px] transition-colors shadow-xs"
                    >
                      Use GNSS Boundary
                    </button>
                    <button
                      onClick={() => handleApplyResolution('Endorse Revenue Cadastral Record')}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[11px] transition-colors shadow-xs"
                    >
                      Accept Revenue
                    </button>
                    <button
                      onClick={() => handleApplyResolution('Endorse Municipal Assessment GIS')}
                      className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-[11px] transition-colors shadow-xs"
                    >
                      Accept Municipal
                    </button>
                    <button
                      onClick={() => requestGroundSurvey(activeConflict.id)}
                      className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded font-semibold text-[11px] hover:bg-slate-800 transition-colors shadow-xs"
                    >
                      Request Ground Survey
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Conflict Successfully Resolved</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                    Action: {activeConflict.resolvedAction} · By {activeConflict.resolvedBy} on {activeConflict.resolvedAt}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ALL CONFLICTS TABLE (SECTION 22) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Spatial Conflict Ledger ({conflicts.length})
          </h3>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-xs"
              >
                <option value="All">All ({conflicts.length})</option>
                <option value="Active">Active Only</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Conflict ID</th>
                <th className="py-3 px-3">Parcel & Survey</th>
                <th className="py-3 px-3">Conflict Classification</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Sources in Dispute</th>
                <th className="py-3 px-3 font-mono text-right">Area Delta</th>
                <th className="py-3 px-3 font-mono text-right">Confidence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(c => {
                const isSelected = activeConflict?.id === c.id;
                return (
                  <tr 
                    key={c.id} 
                    onClick={() => {
                      setSelectedConflictId(c.id);
                      setSelectedParcelId(c.parcelId);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-red-50/70 dark:bg-red-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-red-600">
                      {c.id}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-900 dark:text-white">{c.parcelId}</span>
                      <span className="text-[10px] text-slate-500 block">Survey #{c.surveyNumber}</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {c.type}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        c.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-slate-400">
                      {c.sources.join(' + ')}
                    </td>
                    <td className="py-3 px-3 font-mono text-right font-bold text-red-600">
                      {c.areaDifferenceSqm} m²
                    </td>
                    <td className="py-3 px-3 font-mono text-right font-semibold text-slate-700 dark:text-slate-300">
                      {c.confidenceScore}%
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        c.status === 'Resolved' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConflictId(c.id);
                          setSelectedParcelId(c.parcelId);
                        }}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-800 dark:text-slate-200 font-semibold"
                      >
                        Inspect Dispute
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
  );
};
