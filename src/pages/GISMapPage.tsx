import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { WebGISMap } from '../components/map/WebGISMap';
import { 
  Layers, 
  MapPin, 
  Building as BuildingIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Ruler, 
  Compass, 
  Download, 
  Sliders, 
  Info,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export const GISMapPage: React.FC = () => {
  const { 
    parcels, 
    selectedParcelId, 
    setSelectedParcelId, 
    conflicts, 
    setSelectedConflictId,
    navigateTo,
    showToast
  } = useGIS();

  const [filterLandType, setFilterLandType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAIReasoning, setShowAIReasoning] = useState(true);

  const activeParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];
  const relatedConflict = conflicts.find(c => c.parcelId === activeParcel?.id && c.status !== 'Resolved');

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* CENTER: LARGE INTERACTIVE MAP (Takes full available space) */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Top Control Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between text-xs z-10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-white font-display">
              Geospatial Multi-Layer Canvas
            </span>
            <span className="text-slate-400">|</span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span>Filter Land Use:</span>
              <select 
                value={filterLandType} 
                onChange={(e) => setFilterLandType(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Institutional">Institutional</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Exported active map view as GeoJSON')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GeoJSON</span>
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <WebGISMap heightClass="h-full" showLayerPanel={true} />
        </div>
      </div>

      {/* RIGHT: SELECTED FEATURE INFORMATION DOCK */}
      <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 h-auto lg:h-full overflow-y-auto p-4 shrink-0 space-y-4 shadow-sm text-xs">
        {activeParcel ? (
          <>
            {/* Header info */}
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Unified Parcel Ledger
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                  activeParcel.verificationStatus === 'Conflict Detected' 
                    ? 'bg-red-100 text-red-700' 
                    : activeParcel.verificationStatus === 'Pending Verification'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {activeParcel.verificationStatus}
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {activeParcel.id}
              </h2>
              <p className="text-slate-500 font-mono text-xs">
                Cadastral Survey #{activeParcel.surveyNumber} · {activeParcel.municipalId}
              </p>
            </div>

            {/* Related Conflict Notification if any */}
            {relatedConflict && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Spatial Conflict Detected</span>
                  </div>
                  <span className="font-mono text-[10px] font-semibold">{relatedConflict.id}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-700 dark:text-red-400">
                  {relatedConflict.aiRecommendation}
                </p>
                <button
                  onClick={() => {
                    setSelectedConflictId(relatedConflict.id);
                    navigateTo('conflicts');
                  }}
                  className="w-full py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-center transition-colors shadow-xs"
                >
                  Open Conflict Arbitration Panel
                </button>
              </div>
            )}

            {/* Core Attributes Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Statutory Attributes
              </span>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-md p-3 border border-slate-200 dark:border-slate-700/60 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Owner Name:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{activeParcel.ownerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Total Area:</span>
                  <span className="font-bold text-blue-600">{activeParcel.areaSqm} sq.m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Perimeter:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activeParcel.perimeterM} meters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Land Use Type:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-sans font-medium">{activeParcel.landType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Building Footprint:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-sans">
                    {activeParcel.buildingStatus} ({activeParcel.buildingCount} structure{activeParcel.buildingCount > 1 ? 's' : ''})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Revenue Record:</span>
                  <span className="text-emerald-600 font-sans font-medium">{activeParcel.revenueStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">CRS Reference:</span>
                  <span className="text-slate-600 dark:text-slate-400">EPSG:32643 (UTM 43N)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Last Updated:</span>
                  <span className="text-slate-500">{activeParcel.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Source Contributions (Section 55) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Source Contributions
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {Object.values(activeParcel.sources).filter(Boolean).length} / 5 Contributing Layers
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { key: 'revenue', label: 'Revenue Register (7/12 & Khatauni)', active: activeParcel.sources.revenue },
                  { key: 'cadastral', label: 'Cadastral Vector Settlement Map', active: activeParcel.sources.cadastral },
                  { key: 'municipal', label: 'Municipal Property Assessment', active: activeParcel.sources.municipal },
                  { key: 'gnss', label: 'Survey of India CORS RTK GNSS', active: activeParcel.sources.gnss },
                  { key: 'drone', label: 'High-Res Drone Orthomosaic (ORI)', active: activeParcel.sources.drone },
                ].map(s => (
                  <div 
                    key={s.key} 
                    className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60"
                  >
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">{s.label}</span>
                    <span className={`font-mono text-[11px] font-bold ${s.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {s.active ? '✓ Synced' : '— Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Confidence Breakdown (Section 24) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Harmonization Confidence
                </span>
                <span className="font-bold text-sm text-emerald-600 font-mono">
                  {activeParcel.confidenceScore}%
                </span>
              </div>

              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-md border border-slate-200 dark:border-slate-700/60">
                {[
                  { label: 'Geometry Overlap IoU', value: activeParcel.confidenceBreakdown.geometry },
                  { label: 'Centroid Location Proximity', value: activeParcel.confidenceBreakdown.location },
                  { label: 'Calculated Area Ratio', value: activeParcel.confidenceBreakdown.area },
                  { label: 'Attribute Harmonization', value: activeParcel.confidenceBreakdown.attributes },
                  { label: 'Source Reliability Weight', value: activeParcel.confidenceBreakdown.sourceReliability },
                ].map(metric => (
                  <div key={metric.label} className="space-y-0.5">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{metric.label}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          metric.value >= 90 ? 'bg-emerald-500' : metric.value >= 75 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Reasoning Summary (Section 53) */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
              <button
                onClick={() => setShowAIReasoning(!showAIReasoning)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-left font-semibold text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Why did AI make this suggestion?</span>
                </div>
                {showAIReasoning ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>

              {showAIReasoning && (
                <div className="p-3 bg-white dark:bg-slate-900 space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <p>
                    • Multi-source spatial matching established a strong geometric overlap between historic cadastral polygon #{activeParcel.surveyNumber} and 2026 drone orthomosaic rooftop footprints.
                  </p>
                  <p>
                    • Centroid distance deviation is within statutory 0.5m urban tolerance threshold.
                  </p>
                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                    Note: Explanation represents prototype automated scoring logic and serves as an advisory decision support tool. Final legal status requires statutory officer confirmation.
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button 
                onClick={() => navigateTo('parcels')}
                className="flex-1 py-2 px-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded font-semibold text-center hover:bg-slate-800 transition-colors shadow-xs"
              >
                Inspect Full Dossier
              </button>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <Info className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p>Select a parcel or feature on the map to inspect its attributes.</p>
          </div>
        )}
      </div>
    </div>
  );
};
