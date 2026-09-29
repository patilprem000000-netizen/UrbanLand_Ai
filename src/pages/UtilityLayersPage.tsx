import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { UtilityNetwork } from '../types/gis';
import { Cable, Search, AlertTriangle, CheckCircle2, MapPin, Download } from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const UtilityLayersPage: React.FC = () => {
  const { utilities, setSelectedParcelId, navigateTo, showToast } = useGIS();
  const [selectedUtilityId, setSelectedUtilityId] = useState<string>(utilities[0]?.id || 'UTL-WTR-01');

  const activeUtility = utilities.find(u => u.id === selectedUtilityId) || utilities[0];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Sub-Surface Utility Networks & Infrastructure GIS
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-semibold">
              Right-of-Way & Easements
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Map underground water mains, high-voltage electrical corridors, drainage sewers, and optical fiber lines with parcel easements.
          </p>
        </div>

        <button
          onClick={() => showToast('Exported utility corridor vectors as GeoJSON')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Utility GIS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map with utility overlays */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white">
              Underground Infrastructure Corridors
            </span>
            <div className="flex items-center gap-3 font-mono text-[10px]">
              <span className="text-blue-600 font-bold">● Water Main</span>
              <span className="text-amber-600 font-bold">● Electric Grid</span>
              <span className="text-purple-600 font-bold">● Drainage</span>
            </div>
          </div>

          <WebGISMap heightClass="h-96" showLayerPanel={false} />
        </div>

        {/* Right: Selected utility inspector */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Utility Corridor Inspector
          </h3>

          <div className="space-y-1.5">
            {utilities.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUtilityId(u.id)}
                className={`w-full text-left p-2.5 rounded-md border transition-all ${
                  selectedUtilityId === u.id 
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 font-semibold' 
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-900 dark:text-white">{u.id}</span>
                  <span className="text-[10px] font-mono font-bold text-blue-600">{u.lengthM} m</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{u.type}</p>
              </button>
            ))}
          </div>

          {activeUtility && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Buried Depth:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeUtility.depthM} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Operational Status:</span>
                <span className="font-bold text-emerald-600 font-sans">{activeUtility.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Source Agency:</span>
                <span className="font-sans text-slate-700 dark:text-slate-300">{activeUtility.source}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-sans block mb-1">Impacted / Intersecting Parcels:</span>
                <div className="flex flex-wrap gap-1 font-mono">
                  {activeUtility.affectedParcels.map(pid => (
                    <button
                      key={pid}
                      onClick={() => {
                        setSelectedParcelId(pid);
                        navigateTo('parcels');
                      }}
                      className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 hover:underline"
                    >
                      {pid}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
