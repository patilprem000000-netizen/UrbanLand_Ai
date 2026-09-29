import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { 
  History, 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  Building2, 
  Trash2, 
  Maximize2, 
  RefreshCw,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const ChangeDetectionPage: React.FC = () => {
  const { changeEvents, showToast, addAuditLog, navigateTo, setSelectedParcelId } = useGIS();

  const [oldDataset, setOldDataset] = useState('2024 Urban Baseline Cadastral Layer');
  const [newDataset, setNewDataset] = useState('2026 Drone Photogrammetry Orthomosaic');
  const [isDetecting, setIsDetecting] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 for visual comparison

  const handleDetectChanges = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      showToast('Temporal change detection executed. 326 new buildings and 72 boundary shifts cataloged.');
      addAuditLog('Change Detection', `${oldDataset} vs ${newDataset}`, 'Success', 'Identified 326 newly constructed structures');
    }, 1100);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Temporal Change Detection & Urban Expansion
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Multi-Epoch Photogrammetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detect newly constructed building footprints, unauthorized encroaching structures, and road widening across survey epochs.
          </p>
        </div>

        <button
          onClick={handleDetectChanges}
          disabled={isDetecting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          {isDetecting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Epoch Diffs...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Detect Temporal Changes</span>
            </>
          )}
        </button>
      </div>

      {/* EPOCH SELECTOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          Compare Datasets Across Time Epochs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Historic Baseline Epoch (Dataset 1)
            </label>
            <select
              value={oldDataset}
              onChange={(e) => setOldDataset(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="2024 Urban Baseline Cadastral Layer">2024 Urban Baseline Cadastral Layer (Pre-Survey)</option>
              <option value="2022 Town Planning Master Scheme">2022 Town Planning Master Scheme</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Current Epoch (Dataset 2)
            </label>
            <select
              value={newDataset}
              onChange={(e) => setNewDataset(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="2026 Drone Photogrammetry Orthomosaic">2026 Drone Photogrammetry Orthomosaic (5cm GSD)</option>
              <option value="2026 CORS RTK Rover Survey Updates">2026 CORS RTK Rover Survey Updates</option>
            </select>
          </div>
        </div>
      </div>

      {/* METRIC KPI CARDS (SECTION 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">New Buildings</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 block mt-1">326</span>
          <span className="text-[10px] text-slate-400 font-mono">+18.4% footprint area</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Removed Buildings</span>
          <span className="text-2xl font-bold font-mono text-red-600 block mt-1">21</span>
          <span className="text-[10px] text-slate-400 font-mono">Demolished or cleared</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Boundary Shifts</span>
          <span className="text-2xl font-bold font-mono text-amber-600 block mt-1">72</span>
          <span className="text-[10px] text-slate-400 font-mono">Setback compound walls</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Road Changes</span>
          <span className="text-2xl font-bold font-mono text-blue-600 block mt-1">34</span>
          <span className="text-[10px] text-slate-400 font-mono">Arterial widening</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Land Use Changes</span>
          <span className="text-2xl font-bold font-mono text-purple-600 block mt-1">91</span>
          <span className="text-[10px] text-slate-400 font-mono">Agri to Commercial conversion</span>
        </div>
      </div>

      {/* BEFORE / AFTER SLIDER WEBGIS MAP (SECTION 21) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Temporal Visual Comparison Canvas
            </h3>
            <p className="text-xs text-slate-500">
              Drag the interactive comparison slider to reveal 2026 drone imagery over 2024 vector cadastral sheets.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-500">2024 Baseline (Left)</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPosition} 
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-36 accent-blue-600 cursor-pointer"
            />
            <span className="text-blue-600 font-bold">2026 Drone ORI (Right)</span>
          </div>
        </div>

        <WebGISMap 
          heightClass="h-96" 
          isSplitView={true} 
          splitDatasetA="2024 Cadastral Baseline"
          splitDatasetB="2026 Drone Orthomosaic Footprints"
        />
      </div>

      {/* DETECTED EVENTS LEDGER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Cataloged Temporal Change Events
          </h3>
          <span className="text-xs font-mono text-slate-500">{changeEvents.length} Events Logged</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3">Parcel Affected</th>
                <th className="py-3 px-4">Previous State (2024)</th>
                <th className="py-3 px-4">Current State (2026)</th>
                <th className="py-3 px-3 font-mono text-right">Area Delta</th>
                <th className="py-3 px-3 font-mono text-right">Confidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {changeEvents.map(evt => (
                <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {evt.id}
                  </td>
                  <td className="py-3 px-3 font-semibold text-purple-600">
                    {evt.type}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                    {evt.parcelId}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {evt.previousState}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    {evt.currentState}
                  </td>
                  <td className={`py-3 px-3 font-mono text-right font-bold ${evt.areaChangeSqm > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {evt.areaChangeSqm > 0 ? `+${evt.areaChangeSqm}` : evt.areaChangeSqm} m²
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-bold text-slate-700 dark:text-slate-300">
                    {evt.confidence}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedParcelId(evt.parcelId);
                        navigateTo('parcels');
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 font-semibold"
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
