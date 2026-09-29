import React, { useState } from 'react';
import { useGIS } from '../services/gisContext';
import { Building, UploadCloud, RefreshCw, Layers, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { WebGISMap } from '../components/map/WebGISMap';

export const MunicipalGISPage: React.FC = () => {
  const { parcels, navigateTo, showToast, triggerAIHarmonization } = useGIS();
  const [activeTab, setActiveTab] = useState<'layers' | 'comparison'>('layers');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Municipal Corporation GIS & Property Tax Layer
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
              Town Planning Integration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Synchronize municipal assessment wards, property tax identifiers, and statutory master plan reservations with cadastral parcels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerAIHarmonization();
              showToast('Cross-checking municipal building footprints with revenue boundaries...');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Harmonize with Cadastral Layer</span>
          </button>
        </div>
      </div>

      {/* MUNICIPAL LAYERS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-slate-400 font-medium">Assessed Municipal Parcels</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white block">98 Wards</span>
          <span className="text-slate-500 text-[11px]">94% mapped to Revenue Survey numbers</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-slate-400 font-medium">Master Plan Setbacks</span>
          <span className="text-2xl font-bold font-mono text-blue-600 block">12m Road Buffer</span>
          <span className="text-slate-500 text-[11px]">Encroachment alerts enabled</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-slate-400 font-medium">Coordinate System</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 block">EPSG:32643</span>
          <span className="text-slate-500 text-[11px]">Re-projected from local grid</span>
        </div>
      </div>

      {/* MUNICIPAL WEBGIS WORKSPACE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
            Municipal Assessment Overlay & Zoning Boundaries
          </h3>
          <span className="text-xs font-mono text-slate-500">Zone 4 · Ward 18</span>
        </div>
        <WebGISMap heightClass="h-96" showLayerPanel={true} />
      </div>
    </div>
  );
};
